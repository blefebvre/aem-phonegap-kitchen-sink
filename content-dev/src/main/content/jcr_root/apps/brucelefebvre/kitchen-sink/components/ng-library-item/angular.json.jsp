<%@ page session="false"
           import="com.adobe.cq.commerce.api.Product,
                   com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                   org.apache.sling.api.resource.Resource" %><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@include file="/apps/geometrixx-outdoors-app/global.jsp"%><%

    // Get the product this page represents
    Resource currentPageResource = currentPage.adaptTo(Resource.class);
    String productPrice = "n/a";
    String summaryHTML = "";
    String title = "no title";
    String description = "";
    String sku = "";
    String author = "no author";
    String imageSrc = "";
    Product product = getProduct(currentPageResource);

    if (product != null) {
        title = product.getTitle();
        description = product.getDescription();
        sku = product.getSKU();
        productPrice = getProductPrice(product, currentPageResource, slingRequest, slingResponse);
        author = product.getProperty("author", String.class);
    }
    request.setAttribute("productPrice", productPrice);

    Resource imageResource = currentPage.getContentResource().getChild("image");
    if (imageResource != null) {
        Resource topLevelAppResource = FrameworkContentExporterUtils.getTopLevelAppResource(currentPage.adaptTo(Resource.class));
        boolean appExport = Boolean.parseBoolean(slingRequest.getParameter("appExport"));
        imageSrc = currentPage.getPath() + ".img.png";
        imageSrc = FrameworkContentExporterUtils.getPathToAsset(topLevelAppResource, imageSrc, appExport);
    }

    // TODO: implement numberOfLikes and numberOfComments
%>
{
    items: 
	[
        {
            'title': '<%= xssAPI.encodeForJSString(title) %>',
            'author': '<%= xssAPI.encodeForJSString(author) %>',
            'description': '<%= xssAPI.encodeForJSString(description) %>',
            'price': '<%= xssAPI.encodeForJSString(productPrice) %>',
            'SKU': '<%= xssAPI.encodeForJSString(sku) %>',
            'imageSrc': '<%= xssAPI.encodeForJSString(imageSrc) %>',
            'numberOfLikes': '0',
            'numberOfComments': '0'
        }
    ]
}