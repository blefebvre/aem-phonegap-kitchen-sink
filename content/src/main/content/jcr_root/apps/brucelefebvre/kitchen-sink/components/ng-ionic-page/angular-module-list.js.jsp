<%@ page session="false"
           import="com.day.cq.wcm.api.components.IncludeOptions" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
%><%
    // Prevent wrapping of module .js content
    IncludeOptions opts = IncludeOptions.getOptions(request, true);
    opts.setDecorationTagName("");
    opts.forceSameContext(Boolean.TRUE);

    slingResponse.setContentType("application/javascript");

%>[
'ngRoute',
'ngTouch',
'ngAnimate',
'ngSanitize',
'cqContentSync',
'cqAppControllers',
'cqAppNavigation',
'phonegapLocation',
'phonegapCompass',
'snap',
'phonegapConnection',
'phonegapCamera'
]