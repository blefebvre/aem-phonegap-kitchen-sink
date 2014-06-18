<%@ page session="false"
           import="com.adobe.cq.commerce.api.Product,
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
    Product product = getProduct(currentPageResource);

    if (product != null) {
        title = product.getTitle();
        description = product.getDescription();
        sku = product.getSKU();
        productPrice = getProductPrice(product, currentPageResource, slingRequest, slingResponse);
        author = product.getProperty("author", String.class);
    }
    request.setAttribute("productPrice", productPrice);

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
            'numberOfLikes': '0',
            'numberOfComments': '0'
        }
    ]
}