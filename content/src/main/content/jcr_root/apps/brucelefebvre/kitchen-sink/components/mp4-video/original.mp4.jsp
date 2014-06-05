<%@page session="false"%><%@ include file="/libs/foundation/global.jsp" %><%
%><%@ page import="com.day.cq.dam.api.Asset" %><%
%><%
    // Locate the referenced asset
    Asset asset = null;
    Resource assetRes = resourceResolver.getResource(properties.get("asset", ""));

    if (assetRes != null) {
        asset = assetRes.adaptTo(Asset.class);
    }

    if (asset != null) {
        String assetPath = asset.getPath();

        slingResponse.sendRedirect(assetPath);
    }
%>