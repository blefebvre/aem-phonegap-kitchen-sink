<%@ page session="false"
           import="com.day.cq.tagging.Tag,
                   com.day.cq.tagging.TagManager,
                   com.adobe.cq.commerce.api.Product,
                   com.day.cq.commons.RangeIterator,
                   com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                   org.apache.sling.api.resource.Resource"%><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@include file="/apps/geometrixx-outdoors-app/global.jsp"%><%

%><div class="full responsive-row padded">
<%
    final String PRODUCT_IMAGE_RELATIVE_PATH = "content-par/ng-product/ng-image";
    final String PRODUCT_IMAGE_RESOURCE_TYPE = "mobileapps/components/image";
    final String NG_TEMPLATE_PAGE_RESOURCE_TYPE = "geometrixx-outdoors-app/components/angular/ng-template-page";

    String tag = currentPage.getProperties().get("tag", "");
    String productRootPath = FrameworkContentExporterUtils.getTopLevelAppResource(currentPage.getContentResource()).getPath() + "/products";

    if (tag.length() > 0) {
        TagManager tagManager = resourceResolver.adaptTo(TagManager.class);

        String[] tags = {tag};
        RangeIterator<Resource> taggedPages = tagManager.find(productRootPath, tags);

        // only show a limited number of products if the category is not a leaf
        boolean throttle = tagManager.resolve(tag).listChildren().hasNext();
        int throttleCount = 0;

        while(taggedPages.hasNext() && (!throttle || ++throttleCount < 4)){
            Resource productPageResource = taggedPages.next();
            // Get the product represented by this page
            Product product = getProduct(productPageResource);
            if (product != null) {
                // Determine the product path
                Resource productPageTemplateResource = FrameworkContentExporterUtils.getAncestorTemplateResource(productPageResource, NG_TEMPLATE_PAGE_RESOURCE_TYPE);
                String productSKU = product.getSKU();
                String templatePath = productPageTemplateResource.getPath();
                String price = getProductPrice(product, productPageResource, slingRequest, slingResponse);
                Resource productImageResource = resourceResolver.getResource(productPageResource, PRODUCT_IMAGE_RELATIVE_PATH);
                pageContext.setAttribute("hasProductImage", (productImageResource != null));
%>
    <div class="responsive-cell product-menu-item" ng-click="goProduct('<%= request.getContextPath() %><%= xssAPI.getValidHref(templatePath) %>', '<%= xssAPI.getValidHref(productSKU) %>')">
        <cq:include path="<%= productImageResource.getPath() %>" resourceType="<%= PRODUCT_IMAGE_RESOURCE_TYPE %>"/>

        <span class="product-info-bar">
            <span class="product-preview-price"><%= xssAPI.encodeForHTML(price) %></span>
            <span class="product-button" ng-click="likeClickHandler($event)"></span>
        </span>
    </div>
<%
            }
        }
    }
%>
</div>