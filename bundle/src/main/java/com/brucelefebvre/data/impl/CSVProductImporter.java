package com.brucelefebvre.data.impl;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.Iterator;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.PropertyIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.commerce.pim.api.ProductImporter;
import com.adobe.cq.commerce.pim.common.AbstractProductImporter;
import com.adobe.cq.commerce.pim.common.Csv;
import com.adobe.granite.workflow.launcher.ConfigEntry;

/**
 * Imports products from a CSV file.
 *
 * Each row of the CSV describes a product.
 *
 * Row structure:
 *  operation, type, sku, title, property=value, sizes, price, image, description, tags, additional-property=value, ...
 *
 * Operations supported are 'add', 'update' and 'delete'.
 * Add is supported for the types 'product', 'variation' and 'size'.
 * Update and delete are only supported for 'product'.
 */
@Component(metatype = true, label = "Kitchen Sink Product Importer",
        description ="CSV-based product importer for the Kitchen Sink app")
@Service
@Properties(value = {
        @Property(name = "service.description", value = "CSV-based product importer for the Kitchen Sink app"),
        @Property(name = "commerceProvider", value = "kitchensink", propertyPrivate = true)
})
public class CSVProductImporter extends AbstractProductImporter implements ProductImporter {
    private static final Logger log = LoggerFactory.getLogger(CSVProductImporter.class);

    // row structure:
    //   operation, type, sku, title, property=value, sizes, price, image, description, tags, additional-property=value, ...
    protected static final int OPERATION_COL = 0;
    protected static final int TYPE_COL = 1;
    protected static final int SKU_COL = 2;
    protected static final int TITLE_COL = 3;
    protected static final int AUTHOR_COL = 4;
    protected static final int PRICE_COL = 5;
    protected static final int IMAGE_COL = 6;
    protected static final int DESCRIPTION_COL = 7;
    protected static final int TAGS_COL = 8;
    protected static final int FIRST_CUSTOM_PROP_COL = 9;

    protected Iterator<String[]> inputIterator;

    //
    // This sample importer suspends all workflows targeting /etc/commerce/products/ during product import.
    //

    protected final String productsRoot = "/etc/commerce/products/";

    @Override
    protected boolean disableWorkflowPredicate(ConfigEntry workflowConfigEntry) {
        return workflowConfigEntry.getGlob().startsWith(productsRoot);
    }

    @Override
    protected boolean validateInput(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        ResourceResolver resourceResolver = request.getResourceResolver();

        String provider = request.getParameter("provider");
        if (StringUtils.isEmpty(provider)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "No commerce provider specified.");
            return false;
        }

        String csvPath = request.getParameter("csvPath");
        InputStream is;
        try {
            Resource csvResource = resourceResolver.getResource(csvPath);
            Node source = csvResource.adaptTo(Node.class);
            is = source.getProperty(JcrConstants.JCR_CONTENT + "/" + JcrConstants.JCR_DATA).getBinary().getStream();
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Product CSV [" + csvPath + "] not found.");
            return false;
        }

        String sep = request.getParameter("separator");
        String del = request.getParameter("delimiter");
        Csv csv = new Csv();
        if (sep != null) {
            csv.setFieldSeparatorRead(sep.charAt(0));
        }
        if (del != null) {
            csv.setFieldDelimiter(del.charAt(0));
        }
        inputIterator = csv.read(is, "utf-8");

        if (!inputIterator.hasNext()) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Product CSV empty.");
            return false;
        }

        // first row is header
        inputIterator.next();

        if (!inputIterator.hasNext()) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Product CSV contains header but no products.");
            return false;
        }

        String storePath = request.getParameter("storePath");
        String storeName = request.getParameter("storeName");
        if (StringUtils.isEmpty(storePath) && StringUtils.isEmpty(storeName)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Destination not specified.");
            return false;
        }

        return true;
    }

    @Override
    protected void doImport(ResourceResolver resourceResolver, Node storeRoot, boolean incrementalImport)
            throws RepositoryException, IOException {

        String storePath = storeRoot.getPath();

        while (inputIterator.hasNext()) {
            String[] cols = inputIterator.next();
            String op = get(cols, OPERATION_COL);
            String type = get(cols, TYPE_COL);
            String sku = get(cols, SKU_COL);
            if (op.equals("add")) {
                if (type.equals("product")) {
                    addProduct(resourceResolver, storePath, sku, cols);
                } else {
                    logMessage("ERROR unknown type: " + type, true);
                    log.error("Row of unknown type: " + type);
                }
            } else if (op.equals("update")) {
                if (type.equals("product")) {
                    updateProduct(resourceResolver, storePath, sku, cols);
                } else {
                    logMessage("ERROR unknown type: " + type, true);
                    log.error("Row of unknown type: " + type);
                }
            } else if (op.equals("delete")) {
                if (type.equals("product")) {
                    deleteProduct(resourceResolver, storePath, sku);
                } else {
                    logMessage("ERROR unknown type: " + type, true);
                    log.error("Row of unknown type: " + type);
                }
            } else {
                logMessage("ERROR unknown operation: " + op, true);
                log.error("Row of unknown type: " + op);
            }
        }
    }

    protected void addProduct(ResourceResolver resourceResolver, String storePath, String sku, String[] cols) {
        String path = getProductPath(storePath, sku);
        try {
            // Create product node:
            //
            Node productNode = createProduct(path, resourceResolver.adaptTo(Session.class));

            // Set any specified properties:
            //
            setProperties(resourceResolver, productNode, cols, false);

        } catch (Exception e) {
            logMessage("ERROR creating " + path, true);
            log.error("Failed to create product " + path, e);
        }
    }

    protected void updateProduct(ResourceResolver resourceResolver, String storePath, String sku, String[] cols) {
        try {
            Resource product = resourceResolver.getResource(getProductPath(storePath, sku));
            if (product == null) {
                throw new RuntimeException("product doesn't exist");
            }
            Node productNode = product.adaptTo(Node.class);

            // Clear existing variations, images, etc.
            if (productNode.hasNodes()) {
                NodeIterator it = productNode.getNodes();
                while (it.hasNext()) {
                    it.nextNode().remove();
                }
            }

            // Set any specified properties:
            //
            setProperties(resourceResolver, productNode, cols, true);

            // Inform superclass:
            //
            productUpdated(productNode);
        } catch (Exception e) {
            logMessage("ERROR updating " + sku, true);
            log.error("Failed to update product " + sku, e);
        }
    }

    protected void deleteProduct(ResourceResolver resourceResolver, String storePath, String sku) {
        try {
            Resource product = resourceResolver.getResource(getProductPath(storePath, sku));
            if (product == null) {
                throw new RuntimeException("product doesn't exist");
            }
            Node productNode = product.adaptTo(Node.class);

            // Inform superclass:
            //
            productDeleted(productNode);

            productNode.remove();
        } catch (Exception e) {
            logMessage("ERROR deleting " + sku, true);
            log.error("Failed to delete product " + sku, e);
        }
    }

    protected void setProperties(ResourceResolver resourceResolver, Node node, String[] cols, boolean update) throws RepositoryException {
        if (update) {
            // Clear any existing, non-system properties:
            for (PropertyIterator existingProps = node.getProperties(); existingProps.hasNext(); ) {
                javax.jcr.Property prop = (javax.jcr.Property) existingProps.next();
                String propName = prop.getName();
                if (propName.equals("jcr:title") || propName.equals("jcr:description") || propName.equals("cq:tags")) {
                    prop.remove();
                } else if (!propName.startsWith("jcr:") && !propName.startsWith("sling:") && !propName.startsWith("cq:")
                        && !prop.getDefinition().isAutoCreated() && !prop.getDefinition().isProtected()) {
                    prop.remove();
                }
            }
            // Remove any existing image:
            if (node.hasNode("image")) {
                node.getNode("image").remove();
            }
        }

        String title = get(cols, TITLE_COL);
        if (StringUtils.isNotEmpty(title)) {
            node.setProperty("jcr:title", title);
        }
        String author = get(cols, AUTHOR_COL);
        if (StringUtils.isNotEmpty(author)) {
            node.setProperty("author", author);
        }
        String sku = get(cols, SKU_COL);
        if (StringUtils.isNotEmpty(sku)) {
            node.setProperty("identifier", sku);
        }
        String price = get(cols, PRICE_COL);
        if (StringUtils.isNotEmpty(price)) {
            node.setProperty("price", new BigDecimal(price));
        }
        String imageUrl = get(cols, IMAGE_COL);
        if (StringUtils.isNotEmpty(imageUrl)) {
            Node imageNode = createImage(node);
            imageNode.setProperty("fileReference", imageUrl);
        }
        String description = get(cols, DESCRIPTION_COL);
        if (StringUtils.isNotEmpty(description)) {
            node.setProperty("jcr:description", description);
        }
        String tagCol = get(cols, TAGS_COL);
        if (StringUtils.isNotEmpty(tagCol)) {
            if (!node.isNodeType("cq:Taggable")) {
                node.addMixin("cq:Taggable");
            }
            String tags[] = tagCol.split(",");
            createMissingTags(resourceResolver, tags);
            node.setProperty("cq:tags", tags);
        }
        for (int i = FIRST_CUSTOM_PROP_COL; i < cols.length; i++) {
            String customPropDefinition = cols[i];
            if (StringUtils.isNotEmpty(customPropDefinition)) {
                String parts[] = customPropDefinition.split("=", 2);
                String name = parts[0].trim();
                if (parts.length != 2 || !mangleName(name).equals(name)) {
                    logMessage("ERROR adding custom property: syntax error in property definition", true);
                    log.error("Custom property syntax error");
                } else {
                    node.setProperty(name, parts[1]);
                }
            }
        }
    }

    private String get(String[] cols, int i) {
        if (i < cols.length) {
            return cols[i];
        } else {
            return null;
        }
    }

    protected String getProductPath(String storePath, String sku) {
        String productSKU = sku;
        boolean variation = false;

        String path = storePath + "/" + sku.substring(0, 2) + "/" + sku.substring(0, 4) + "/" + productSKU;
        if (variation) {
            path += "/" + sku;
        }
        return path;
    }
}