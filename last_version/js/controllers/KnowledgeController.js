// Angular code
(function (){
	//Application module
	angular.module('compentencyProfile').controller("KnowledgeController", ['$http', '$scope', '$rootScope', '$filter', '$window', '$timeout', '$routeParams', function ($http, $scope, $rootScope, $filter, $window, $timeout, $routeParams) {
		
		//scope variables
		$scope.filters = 0;
		$scope.typeFilterKnowledge = "";
		$scope.selectedDomains = new Array();
		$scope.types = new Array();	
		$scope.selectOnline = false;
		$scope.selectFaceToFace = false;
		$scope.competencyNum = "";
		$scope.competencyName = "";
		$scope.competencyDetails = "";
		$scope.modalShown = false;

		// $scope.number = 1;
	    $rootScope.$on('knowledgeByCompetencyClicked', function (context, data) {
	        $scope.typeFilterKnowledge = data;
	    });

		$scope.$watch("selectedDomains+types+typeFilterKnowledge", function () {
			if (_.isEmpty($scope.selectedDomains) && _.isEmpty($scope.types) && $scope.typeFilterKnowledge == "") {
				$scope.filters = 0;
			} else {
				$scope.filters = 1;
			}
		})
		
		$scope.includeType = function (type) {
			var i = $.inArray(type, $scope.types);
			if (i > -1) {
				$scope.types.splice(i, 1);
			} else {
				$scope.types.push(type);
			}
			$scope.filters = 1;
		}

		$scope.filterOnlineOrFaceToFace = function (knowledge) {
			if ($scope.types.length > 0) {
				if ($.inArray(knowledge.typeOnlineOrFacetoface, $scope.types) < 0) {
					return;
				}
			} 
			return knowledge;
		}

		$scope.filterByDomain = function (knowledge) {
			if ($scope.selectedDomains.length > 0) {
				var matches = 0;
				for (i = 0; i < $scope.selectedDomains.length; i++) {
					if ($.inArray($scope.selectedDomains[i], knowledge.domain) > -1) {
						matches++;
					}
				}
				if (matches != $scope.selectedDomains.length) {
					return;
				}
			}
			return knowledge;
		}

		$scope.reloadPage = function () {
			for (var i = 0; i < $scope.selectedDomains.length; i++) {
				$timeout(function () {
					$(".choices__button").click();
					document.getElementById("typeFilterKnowledge").focus();
				});
			}
			$scope.typeFilterKnowledge = "";
			$scope.selectFaceToFace = false;
			$scope.selectOnline = false;
			$scope.types = Array();
			$scope.filters = 0;
		}

		$scope.toggleModal = function() {
			$scope.modalShown = !$scope.modalShown;
		}

		$scope.modalContent = function (number, name) {
			$scope.competencyNum = number;
			$scope.competencyName = name;
			angular.forEach($scope.$parent.competencyArray, function(value, key) {
				if (value.number == number) {
					$scope.competencyDetails = value.details;
				}
			})
		}

		$scope.redirectModal = function () {
			$scope.modalShown = !$scope.modalShown;
			$scope.$parent.userOption = 1;
		}

	}]);

	angular.module('compentencyProfile').directive("knowledgeBase", function () {
		return {
			restrict: 'E',
			templateUrl:"templates/knowledge-base.html",
			controller:function(){

			},
			controllerAs: 'knowledgeBase'
		};
	});
	
	angular.module('compentencyProfile').directive('tooltipster', function () {
		return {
			restrict: 'A',
			link: function ($scope, $element, $attrs) {
				$element.tooltipster(jQuery.extend({
					theme: 'tooltipster-shadow',
					maxWidth: 500,
					delay: 100,
					interactive: false,
					animation: 'grow',
					side: 'right',
					trigger: 'hover',
					contentAsHTML: true,
					// timer: 10000,
					onlyOne: true,
					contentAsHTML: true,
				}));
			},
		};
	});

	angular.module('compentencyProfile').directive('modalDialog', function() {
		return {
			restrict: 'E',
			scope: {
				show: '='
			},
			replace: true, // Replace with the template below
			transclude: true, // we want to insert custom content inside the directive
			link: function(scope, element, attrs) {
				scope.dialogStyle = {};
				if (attrs.width)
					scope.dialogStyle.width = attrs.width;
				if (attrs.height)
					scope.dialogStyle.height = attrs.height;
				scope.hideModal = function() {
					scope.show = false;
				};
			},
			template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>" 
		};
	});

})();



















