(function(){
	console.log("function anonymous");
	// do somethings
	console.log("do somethings")
})();


let budgetController = (function(){
	let v = 100 ;
	
	function add( num ){
		return v + num;
	}
	
	return {
		publicTest : function(b){
			console.log( add(b)) ;
		}
	}
})();


budgetController.publicTest(5);