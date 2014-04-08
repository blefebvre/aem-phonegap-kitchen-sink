package com.brucelefebvre.media.impl;

import com.day.cq.commons.DownloadResource;
import com.day.cq.commons.jcr.JcrUtil;
import com.day.cq.contentsync.config.ConfigEntry;
import com.day.cq.contentsync.handler.AbstractSlingResourceUpdateHandler;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.foundation.Download;
import com.day.text.Text;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

/**
 * Extract assets that would not otherwise be auto extracted.
 */
@Component(
        metatype = true,
        factory = "com.day.cq.contentsync.handler.ContentUpdateHandler/customresourceupdatehandler",
        inherit = true
)
@Service
public class CustomResourceUpdateHandler extends AbstractSlingResourceUpdateHandler {

    /**
     * Static Logger
     */
    private static final Logger log = LoggerFactory.getLogger(CustomResourceUpdateHandler.class);

    /**
     * Some custom components to extract assets from
     */
    private static final String COMPONENT_VIDEO = "brucelefebvre/kitchen-sink/components/mp4-video";

    private static Set<String> COMPONENTS_TO_SUPPORT = new HashSet<String>();

    static {
        COMPONENTS_TO_SUPPORT.add(COMPONENT_VIDEO);
    }

    /**
     * A node property that is the asset path reference to a dam asset.
     * This is property is 'fileReference' in CQ components. However it can be overwritten if a different property was used.
     */
    private static final String PN_ASSET_REFERENCE_URL_OVERRIDE = "asset";

    private boolean updated = false;

    /**
     * {@inheritDoc}
     */
    public boolean updateCacheEntry(ConfigEntry configEntry, Long lastUpdated, String configCacheRoot, Session adminSession, Session userSession) {
        log.info("Updating cache @ " + configCacheRoot + " as user " + userSession.getUserID());
        configCacheRoot = getConfigCacheRoot(configEntry, configCacheRoot);
        boolean modified = false;
        try {
            ResourceResolver resolver = resolverFactory.getResourceResolver(userSession);
            Page rootPage = resolver.adaptTo(PageManager.class).getPage(configEntry.getContentPath());

            // Extract assets
            updateCache(rootPage, configCacheRoot, adminSession, userSession);

            if (updated) {
                adminSession.save();
                modified = true;
            }
        } catch (Exception ex) {
            log.error("Unexpected error while updating cache for config: " + configEntry.getPath(), ex);
        }
        return modified;
    }

    @Override
    protected String getTargetPath(String path) {
        String name = "/mp4-video.thumb.100.140.png";
        return name;
    }

    private void updateCache(Page page, String configCacheRoot, Session adminSession, Session userSession) throws RepositoryException {
        log.info("Extracting assets from page {}:{}", page.getName(), page.getPath());
        collectAssets(page, configCacheRoot, adminSession, userSession);
        // Collect from sub pages
        Iterator<Page> childPagesIter = page.listChildren();
        while (childPagesIter.hasNext()) {
            Page childPage = childPagesIter.next();
            log.info("Extracting assets from sub page {}:{}", childPage.getName(), childPage.getPath());
            collectAssets(childPage, configCacheRoot, adminSession, userSession);
        }
    }

    /**
     * Collect assets for export
     *
     * @param page            The page to collect from
     * @param configCacheRoot The export cache root to add content for export
     * @param adminSession    The admin session for cache updates
     * @param userSession     The user session for cache updates
     * @throws javax.jcr.RepositoryException
     */
    private void collectAssets(Page page, String configCacheRoot, Session adminSession, Session userSession) throws RepositoryException {
        ComponentVisitor visitor = new ComponentVisitor(configCacheRoot, adminSession, userSession);
        visitor.visit(page.getContentResource());
    }

    /**
     * Resource visitor
     */
    public abstract class ResourceVisitor {

        /**
         * Visit the given resource and all its descendants.
         *
         * @param res The resource
         */
        public void visit(Resource res) {
            if (res != null) {
                accept(res);

                traverseChildren(res.listChildren());
            }
        }

        /**
         * Visit the given resources and all its descendants.
         *
         * @param children The list of resources
         */
        private void traverseChildren(Iterator<Resource> children) {
            while (children.hasNext()) {
                Resource child = children.next();

                accept(child);

                traverseChildren(child.listChildren());
            }
        }

        /**
         * Implement this method to do actual work on the resources.
         *
         * @param res The resource
         */
        protected abstract void accept(Resource res);
    }

    /**
     * Resource visitor to check the node sub hierarchy.
     */
    private class ComponentVisitor extends ResourceVisitor {
        private String configCacheRoot;
        private Session adminSession;
        private Session userSession;
        private ResourceResolver resolver;

        /**
         * Constructor.
         *
         * @param configCacheRoot The export cache root to add content for export
         * @param adminSession    The admin session for cache updates
         * @param userSession     The user session for cache updates
         */
        public ComponentVisitor(String configCacheRoot, Session adminSession, Session userSession) {
            this.configCacheRoot = configCacheRoot;
            this.adminSession = adminSession;
            this.userSession = userSession;
            this.resolver = resolverFactory.getResourceResolver(userSession);
        }

        /**
         * {@inheritDoc}
         */
        protected void accept(Resource resource) {
            try {
                // Check all/any components we're extracting resources for
                for (String componentPath : COMPONENTS_TO_SUPPORT) {
                    if (ResourceUtil.isA(resource, componentPath)) {
                        log.debug("Extracting {} : {}", componentPath, resource.getPath());
                        Download download = new Download(resource);
                        addToExportCache(download);
                        updated = true; // flag cache update occurred
                    } else {
                        log.debug("Ignoring resource " + resource.getPath());
                    }
                }
            } catch (RepositoryException ex) {
                 log.error("Updating export data failed: ", ex);
            }
        }

        /**
         * Add the DAM asset to the export cache.
         *
         * @param download DAM Download Asset
         * @throws javax.jcr.RepositoryException
         */
        private void addToExportCache(DownloadResource download) throws RepositoryException {
            // Assume but test against CQ-like asset component
            if (!download.hasContent()) {
                // override+remap to asset reference property in case it wasn't 'fileReference'
                download.setItemName(DownloadResource.PN_REFERENCE, PN_ASSET_REFERENCE_URL_OVERRIDE);
                // if fileReference is used this override can be removed.
            }

            // If content set, extract
            if (download.hasContent()) {
                String srcDAMPath = download.getFileReference();

                if (srcDAMPath != null && !srcDAMPath.equals("")) {
                    Resource srcRes = resolver.getResource(srcDAMPath);
                    if (srcRes != null && srcRes.adaptTo(Node.class) != null) {
                        String targetName = download.getResource().getName() + ".original.mp4";

                        // resourcePath corresponds to the component path
                        String resourcePath = download.getResource().getParent().getPath();

                        // Directories beginning with '_' are ignored by Android
                        // This replacement prevents 'jcr:content' from becoming '_jcr_content'
                        resourcePath = resourcePath.replaceAll("/jcr:content/", "/jcr_content/");
                        String cacheParentPath = configCacheRoot + resourcePath;

                        Node parent = JcrUtil.createPath(cacheParentPath, "sling:Folder", adminSession);
                        Rendition rendition = srcRes.adaptTo(Asset.class).getOriginal();
                        JcrUtil.copy(rendition.adaptTo(Node.class), parent, targetName);
                        String mimeType = download.getMimeType();
                        if (mimeType != null && mimeType.startsWith("video")) {
                            String assetPath = srcRes.getPath() + ".thumb.100.140.png";
                            log.info("Adding image to content using selector " + assetPath + " for " + srcRes.getPath());
                            updateImageResource(cacheParentPath, assetPath);
                        }
                    }
                } else {
                    // If the component support embedded assets, handle that here
                }
            } else {
                log.debug("Nothing to export from " + download.getPath());
            }
        }

         private void updateImageResource(String cacheDestination, String imageURL) {
            try {
                renderResource(imageURL, cacheDestination, adminSession, userSession);
            } catch (Exception e) {
                log.error("Rendering image resource failed: ", e);
            }
        }
    }
}