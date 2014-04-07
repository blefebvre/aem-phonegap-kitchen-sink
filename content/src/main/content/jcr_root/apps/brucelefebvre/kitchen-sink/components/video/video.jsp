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

  HTML5 video component

  ==============================================================================

--%><%@ include file="/libs/foundation/global.jsp" %><%
%><%@ page import="com.day.cq.dam.api.Asset,
                   com.day.cq.i18n.I18n,
                   com.day.cq.wcm.api.WCMMode,
                   com.day.cq.wcm.api.components.DropTarget,
                   com.day.cq.wcm.foundation.Placeholder" %><%
%><cq:includeClientLib categories="geometrixx.video.player"/><%

//    boolean wcmEditMode = (WCMMode.fromRequest(request) == WCMMode.EDIT);

    I18n i18n = new I18n(slingRequest);
    // try find referenced asset
    Asset asset = null;
    Resource assetRes = resourceResolver.getResource(properties.get("asset", ""));
    if (assetRes != null) {
        asset = assetRes.adaptTo(Asset.class);
    }
    if (asset != null) {
        request.setAttribute("video_asset", asset);

        // allow both pixel & percentage values
        String width = properties.get("width", currentStyle.get("width", String.class));
        String height = properties.get("height", currentStyle.get("height", String.class));

        // allow either just a width or a height to be set (letting the browser handle it)
        // but give a default if nothing is set
        if (width == null && height == null) {
            width = "480";
            height = "320";
        }
        //String wh = (width != null ? "width=\"" + width + "px\"" : "") + " " + (height != null ? "height=\"" + height + "px\"" : "");
        StringBuilder attributes = new StringBuilder();
        String assetPath = asset.getPath();
        String videoThumbnail = assetPath + ".thumb.100.140.png";

        if(WCMMode.fromRequest(request) == WCMMode.DISABLED){
            assetPath = "." + assetPath;
            videoThumbnail = "." + videoThumbnail;
        }

%>

    <video controls poster="<%= xssAPI.encodeForHTMLAttr(videoThumbnail) %>">
        <source src="<%= xssAPI.encodeForHTMLAttr(assetPath) %>" type="video/mp4">
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
%><%= placeholder %><%
    }
%>