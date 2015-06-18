<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false"
           import="com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
			       com.day.cq.wcm.api.WCMMode" %><%
%><%
    boolean wcmMode = WCMMode.fromRequest(request) != WCMMode.DISABLED;
    request.setAttribute("wcmMode", wcmMode);

    // Controller for this component
    request.setAttribute("componentDataPath", FrameworkContentExporterUtils.getJsFriendlyResourceName(resource.getPath()));
%>