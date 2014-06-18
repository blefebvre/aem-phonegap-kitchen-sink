<%@page session="false"
        import="com.day.cq.wcm.api.WCMMode" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
    String headerText = currentPage.getTitle();
%><c:set var="wcmMode"><%= WCMMode.fromRequest(request) != WCMMode.DISABLED %></c:set><%
%>
<%-- Template is only needed when WCMMode is enabled --%>
<c:if test="${wcmMode}">
    <div class="bar bar-header bar-positive">
        <a ng-click="back()" class="button icon-left ion-chevron-left button-clear"></a>
        <h1 class="title"><%= xssAPI.encodeForHTML(headerText) %></h1>
    </div>
    
    <div class="page-content content has-header">
        <cq:include path="content-par" resourceType="foundation/components/parsys" />
    </div>
</c:if>