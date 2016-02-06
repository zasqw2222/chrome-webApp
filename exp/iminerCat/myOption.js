$(function(){
	// chrome.storage.StorageArea.get(null,function(item){
	// 	alert(item)
	// })
console.log(chrome.storage.local)
	var csl = chrome.storage.local;

	var oBtn = $("#btn"),typeValue,min,max;
	oBtn.click(function(){
		typeValue = $('input:checked').val();
		min = $("input[name=min]").val();
		max = $("input[name=max]").val();
		val = $("input[name=val]").val()
		if(!min || !max){
			alert("请输入 最小最大值");
			return false;
		}
		csl.set({
			tv : typeValue,
			min : min,
			max : max,
			val : val
		},function(){
			alert('保存完毕');
		});

	});

	
})