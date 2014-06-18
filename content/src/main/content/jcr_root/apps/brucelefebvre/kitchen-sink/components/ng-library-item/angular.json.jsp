<%@ page session="false"
           import="com.adobe.cq.commerce.api.Product,
                    org.apache.sling.api.resource.Resource" %><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@include file="/apps/geometrixx-outdoors-app/global.jsp"%><%

    // Get the product this page represents
    Resource currentPageResource = currentPage.adaptTo(Resource.class);
    String productPrice = "n/a";
    String summaryHTML = "";
    String title = "";
    String description = "";
    String SKU = "";
    Product product = getProduct(currentPageResource);

    if (product != null) {
        summaryHTML = product.getProperty("summary", String.class);
        if (summaryHTML == null || summaryHTML.equals("...")) {
            summaryHTML = "";
        }
        title = product.getTitle();
        description = product.getDescription();
        SKU = product.getSKU();
        productPrice = getProductPrice(product, currentPageResource, slingRequest, slingResponse);
    }
    request.setAttribute("productPrice", productPrice);

    // TODO: implement numberOfLikes and numberOfComments
%>
{
    items: 
	[
        {
            'name': '<%= xssAPI.encodeForJSString(title) %>',
            'description': '<%= xssAPI.encodeForJSString(description) %>',
            'summaryHTML': '<%= xssAPI.encodeForJSString(summaryHTML) %>',
            'price': '<%= xssAPI.encodeForJSString(productPrice) %>',
            'SKU': '<%= xssAPI.encodeForJSString(SKU) %>',
            'numberOfLikes': '0',
            'numberOfComments': '0'
        }
    ]
}