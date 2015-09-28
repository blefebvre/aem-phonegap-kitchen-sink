<%@include file="/libs/foundation/global.jsp"%><%
%><%@page session="false" 
           import="java.util.List" %><%
%>
<ion-tabs class="tabs-positive tabs-icon-top">
<% 
    String[] tabBarPages = currentStyle.get("tabBarPages", new String[0]);
    for (int i = 0; i < tabBarPages.length; i++) {
        String tabId = "tab" + i;
        String tabBarPagePath = tabBarPages[i];
        Page tabBarPage = pageManager.getPage(tabBarPagePath);
%>  <ion-tab title="<%= xssAPI.encodeForHTMLAttr(tabBarPage.getTitle()) %>" 
      icon-on="ion-ios-<%= xssAPI.encodeForHTMLAttr(tabBarPage.getName()) %>" 
      icon-off="ion-ios-<%= xssAPI.encodeForHTMLAttr(tabBarPage.getName()) %>-outline" 
      ng-click="goTab('<%= request.getContextPath() %><%= xssAPI.getValidHref(tabBarPagePath) %>', '<%= xssAPI.encodeForJSString(tabBarPage.getTitle()) %>', '<%= xssAPI.encodeForJSString(tabId) %>')" >
    </ion-tab>
<%
    }
%>
</ion-tabs>