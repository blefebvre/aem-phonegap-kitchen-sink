<%@page session="false"%><%
%><%@include file="/libs/foundation/global.jsp" %><%
%><cq:includeClientLib js="apps.kitchen-sink.splash-screen"/>

<!-- Enable all requests, inline styles, and eval() -->
<meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'">