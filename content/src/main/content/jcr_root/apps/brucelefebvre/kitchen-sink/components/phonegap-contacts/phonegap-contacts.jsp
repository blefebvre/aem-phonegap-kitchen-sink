<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false" %><%
%>

<div ng-controller="ContactsCtrl" class="list">
	<div class="item item-divider">
		Device Contact List
	</div>
	<div ng-repeat="contact in contacts">
		<a class="item">{{contact.name.formatted}}</a>
	</div>
</div>