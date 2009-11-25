var isWebKit = document.childNodes && !document.all && !navigator.taintEnabled;

TYPO3BackendLogin = {
	start: function() {
		TYPO3BackendLogin.preloadImages();
		TYPO3BackendLogin.registerEventListeners();
		TYPO3BackendLogin.setVisibilityOfClearIcon($('t3-username'), $('t3-username-clearIcon'));
		TYPO3BackendLogin.setVisibilityOfClearIcon($('t3-password'), $('t3-password-clearIcon'));
	},

	preloadImages: function() {
		var image = new Image();
		image.src = 'sysext/t3skin/icons/login-submit-progress.gif';
	},

	registerEventListeners: function() {
		Event.observe(
				$('t3-login-switchToOpenId'),
				'click',
				TYPO3BackendLogin.switchToOpenId
			);
		Event.observe(
			$('t3-login-switchToDefault'),
			'click',
			TYPO3BackendLogin.switchToDefault
		);
		Event.observe(
			$('t3-login-submit'),
			'click',
			TYPO3BackendLogin.showLoginProcess
		);

		$A(['t3-username', 't3-password']).each(function(value) {
			Event.observe(
					$(value + '-clearIcon'),
					'click',
					function() { TYPO3BackendLogin.clearInputField($(value)); }
			);
			TYPO3BackendLogin.observeEvents(
					$(value),
					['focus', 'blur', 'keypress'],
					function() { TYPO3BackendLogin.setVisibilityOfClearIcon($(value), $(value + '-clearIcon')); }
			);
			if (!isWebKit) {
				Event.observe(
					$(value),
					'keypress',
					function(event) { TYPO3BackendLogin.showCapsLockWarning($(value + '-alert-capslock'), event); }
				);
			}
		})
	},

	observeEvents: function(element, events, handler) {
		events.each(function(event) {
			Event.observe(
				element,
				event,
				handler
			);
		});
	},

	setVisibilityOfClearIcon: function(formField, clearIcon) {
		if (formField.value) {
			clearIcon.show();
		} else {
			clearIcon.hide();
		}
	},

	showCapsLockWarning: function(alertIcon, event) {
		if (isCapslock(event)) {
			alertIcon.show();
		} else {
			alertIcon.hide();
		}
	},

	clearInputField: function(formField) {
		formField.value = '';
		formField.focus();
	},

	switchToOpenId: function() {
		$('t3-login-label-username').hide();
		$('t3-login-label-openId').show();
		$('t3-login-openIdLogo').show();

		$('t3-login-form-footer-default').hide();
		$('t3-login-form-footer-openId').show();
		$('t3-login-password-section').hide();

		if ($('t3-login-interface-section')) {
			$('t3-login-interface-section').hide();
		}
	},

	switchToDefault: function() {
		$('t3-login-label-username').show();
		$('t3-login-label-openId').hide();
		$('t3-login-openIdLogo').hide();

		$('t3-login-form-footer-default').show();
		$('t3-login-form-footer-openId').hide();
		$('t3-login-password-section').show();

		if ($('t3-login-interface-section')) {
			$('t3-login-interface-section').show();
		}
	},
	
	showLoginProcess: function() {
		if ($('t3-login-error')) {
			$('t3-login-error').hide();
		}

		$('t3-login-form-fields').hide();
		$('t3-nocookies-error').hide();
		$('t3-login-process').show();
	}
};

Event.observe(window, 'load', TYPO3BackendLogin.start);
