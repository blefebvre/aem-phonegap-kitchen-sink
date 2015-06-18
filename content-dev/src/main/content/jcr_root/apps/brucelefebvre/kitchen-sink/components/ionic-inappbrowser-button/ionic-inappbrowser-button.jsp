<%@ page session="false" %><%
%><%@include file="/libs/foundation/global.jsp"%><%

    String buttonText = properties.get("buttonText", "Click Me");
    String buttonLink = properties.get("buttonLink", "#");

%>
<button onclick="window.open('<%= xssAPI.getValidHref(buttonLink) %>', '_blank');" class="button button-balanced">
	<%= xssAPI.encodeForHTML(buttonText) %>
</button>