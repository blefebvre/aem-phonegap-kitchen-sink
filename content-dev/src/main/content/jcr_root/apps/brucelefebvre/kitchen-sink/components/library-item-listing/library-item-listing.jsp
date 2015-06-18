<%@ page session="false"
           import="com.day.cq.tagging.Tag,
                   com.day.cq.tagging.TagManager,
                   com.adobe.cq.commerce.api.Product,
                   com.day.cq.commons.RangeIterator,
                   com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                   org.apache.sling.api.resource.Resource"%><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@include file="/apps/geometrixx-outdoors-app/global.jsp"%><%

%><div class="list">
<%
    final String NG_TEMPLATE_PAGE_RESOURCE_TYPE = "brucelefebvre/kitchen-sink/components/ng-ionic-page/ng-template-page";

    boolean hasAChildPage = currentPage.listChildren().hasNext();

    // Don't show any library items if this page is not a leaf
    if (hasAChildPage == false ) {

        Tag[] tags = currentPage.getTags();
        String libraryDataRootPath = FrameworkContentExporterUtils.getTopLevelAppResource(currentPage.getContentResource()).getPath() + "/library-data";

        if (tags.length > 0) {

            // Convert tags array to an array of String paths
            String[] tagsIds = new String[tags.length];
            for (int i = 0; i < tags.length; i++) {
                tagsIds[i] = tags[i].getPath();
            }
    
            TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
    
            RangeIterator<Resource> taggedPages = tagManager.find(libraryDataRootPath, tagsIds);

            while(taggedPages.hasNext()){

                Resource productPageResource = taggedPages.next();
                // Get the product represented by this page
                Product product = getProduct(productPageResource);

                if (product != null) {
                    // Determine the product path
                    Resource productPageTemplateResource = FrameworkContentExporterUtils.getAncestorTemplateResource(productPageResource, NG_TEMPLATE_PAGE_RESOURCE_TYPE);
                    String productSKUPrefix = product.getSKU().substring(0,2);
                    String templatePath = productPageTemplateResource.getPath();
%>
    <a class="item" ng-click="goLibraryItem('<%= request.getContextPath() %><%= xssAPI.getValidHref(templatePath) %>', '<%= xssAPI.getValidHref(productSKUPrefix) %>', '<%= xssAPI.getValidHref(productPageResource.getParent().getName()) %>')">
        <%= xssAPI.encodeForHTML(product.getTitle()) %>
    </a>
<%
                }
            }
        }
    }
%>
</div>