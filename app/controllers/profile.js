var args = arguments[0] || {}, user = args.user;

if (user) {
	Ti.API.info("[profile.js] another user");
} else {
	Ti.API.info("[profile.js] loggedInUser");
	user = AG.loggedInUser;
	if (!AG.isLogIn()) {
		//alert("[profile.js] need login!");
	}
}

$.getView().addEventListener('focus', function(e) {
	$.setProperties();
});

$.mainContent.addEventListener('scroll', function(e){
	// Ti.API.info("y:"+e.y);
	// $.profileBannerImage.setTop(e.y);
	
	// $.profileBannerImage.applyProperties({top:e.y, height:212.5-e.y});
	$.profileBannerImage.setHeight( 212.5 - e.y);
	$.controlBar.setTop(182.5 - e.y);
	// $.profileBannerImage.applyProperties({height:212.5-e.y});
	// $.profileBannerImage.animate({
		// duration: 50,
		// // top:e.y, 
		// height:212.5-e.y});
});

$.foodRow.addEventListener('click', function(e) {
	AG.utils.openController(AG.mainTabGroup.activeTab, "photoList", {
		// photoModel : photoCol.get(e.itemId) //clicked Model
	});
});

$.settingDialog.addEventListener('click', function(e) {
	// alert(e);
	if (e.index === 0) {
		AG.settings.get('cloudSessionId') ? AG.loginController.logout() : AG.loginController.requireLogin();
	}
});
$.profileSettingBtn.addEventListener('click', function(e) {
	$.settingDialog.show();
});

//로그인 상태 변경시
AG.settings.on('change:cloudSessionId', loginChangeHandler);

//로그인된 사용자 모델(local에 저장한 properties model) 변경시
AG.loggedInUser.on('change', function(model) {

});

// $.loginBtn.addEventListener('click', function(e) {
// AG.settings.get('cloudSessionId') ? AG.loginController.logout() : AG.loginController.requireLogin();
// });
function loginChangeHandler() {
	// 최초에 이미 로그인 되어 있을 경우에 대한 처리
	if (AG.isLogIn()) {
		// $.resetClass($.loginBtn, 'afterLogin');
	} else {
		// $.resetClass($.loginBtn, 'beforeLogin');
	}
}

loginChangeHandler();

function showCamera() {
	AG.loginController.requireLogin(function() {
		Alloy.createController('cameraOveray', {
			collection : photoCol
		}).showCamera();
	});
}

exports.setProperties = function() {
	// alert(user);
	var fb_id = user.get('external_accounts')[0].external_id;
	$.name.text = user.get('first_name');
	$.profileImage.image = String.format("https://graph.facebook.com/%s/picture?width=%d&height=%d", fb_id, 140, 140);
	AG.facebook.requestWithGraphPath(fb_id, {
		fields : 'cover'
	}, "GET", function(e) {
		// alert(e);
		if (e.success) {
			// alert(JSON.parse(e.result).cover.source);
			$.profileBannerImage.image = JSON.parse(e.result).cover.source;
		}
	});
	// 페이스북에서 정보가져와서 석세스 되면 셋팅하는 코드 쓸 차례 (커버 사진등 )
};

