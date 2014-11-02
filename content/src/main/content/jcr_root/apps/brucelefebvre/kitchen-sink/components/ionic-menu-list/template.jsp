<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false"
           import="java.util.Iterator,
                    com.day.cq.wcm.foundation.Image,
                    com.day.cq.wcm.foundation.List,
                    com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
	                org.apache.sling.api.resource.Resource,
	                org.apache.sling.api.resource.ValueMap,
	                com.day.cq.wcm.api.Page" %>
<%-- initialize the list --%>
<cq:include script="init.jsp"/>
    <ul class="list">
<%
    String TEMPLATE_PAGE_RESOURCE_TYPE = "brucelefebvre/kitchen-sink/components/ng-ionic-page/ng-template-page";

    List list = (List)request.getAttribute("list");
    Iterator<Page> items = list.getPages();
    if (items != null) {
        while (items.hasNext()) {
            Page carouselPage = items.next();
            ValueMap vm = carouselPage.getProperties();
            // Only include Angular pages
            Resource currentPageContentResource = carouselPage.getContentResource();
            // Skip this page if it is an ng-template-page
            if (currentPageContentResource == null || 
                    currentPageContentResource.isResourceType(TEMPLATE_PAGE_RESOURCE_TYPE)) {
                continue;
            }

            String title = (carouselPage.getTitle() == null ? "" : carouselPage.getTitle());
%><%
%>        <a class="item" ng-click="go('<%= xssAPI.getValidHref(carouselPage.getPath()) %>')">
        	<%= xssAPI.encodeForHTML(title) %>
        </a><%
%><%
        }
    }
%>
    </ul>