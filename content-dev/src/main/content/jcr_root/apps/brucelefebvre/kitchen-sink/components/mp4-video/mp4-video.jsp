<%@page session="false"%><%--
  ADOBE CONFIDENTIAL

  Copyright 2013 Adobe Systems Incorporated
  All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and may be covered by U.S. and Foreign Patents,
  patents in process, and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.
--
  ==============================================================================

  HTML5 mp4-video component

  ==============================================================================

--%><%@ include file="/libs/foundation/global.jsp" %><%
%><%@ page import="com.day.cq.dam.api.Asset,
                   com.day.cq.wcm.api.WCMMode,
                   com.day.cq.wcm.api.components.DropTarget,
                   com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                   com.day.cq.wcm.foundation.Placeholder" %><%
%><%

//    boolean wcmEditMode = (WCMMode.fromRequest(request) == WCMMode.EDIT);

    // try find referenced asset
    Asset asset = null;
    Resource assetRes = resourceResolver.getResource(properties.get("asset", ""));
    if (assetRes != null) {
        asset = assetRes.adaptTo(Asset.class);
    }
    if (asset != null) {
        // Determine the top level app resource
        Resource topLevelAppResource = FrameworkContentExporterUtils.getTopLevelAppResource(currentPage.adaptTo(Resource.class));

        boolean appExport = Boolean.parseBoolean(slingRequest.getParameter("appExport"));
        String resourcePath = FrameworkContentExporterUtils.getPathToAsset(topLevelAppResource, request.getContextPath() + resource.getPath(), appExport);

        String videoSrcPath = resourcePath + ".original.mp4";
        String videoPosterPath = resourcePath + ".thumb.100.140.png";
%>

    <video controls poster="<%= xssAPI.encodeForHTMLAttr(videoPosterPath) %>">
        <source src="<%= xssAPI.encodeForHTMLAttr(videoSrcPath) %>" type="video/mp4">
        Your device doesn't support this video. 
    </video>

<%
    request.removeAttribute("video_asset");
} else {
    String ddClassName = DropTarget.CSS_CLASS_PREFIX + "video";
    String classicPlaceholder =
            "<div class=\"" + ddClassName +
                    (WCMMode.fromRequest(request) == WCMMode.EDIT ? " cq-video-placeholder" : "")  +
                    "\"></div>";
    String placeholder = Placeholder.getDefaultPlaceholder(slingRequest, component, classicPlaceholder, ddClassName);
%><%= xssAPI.filterHTML(placeholder) %><%
    }
%>