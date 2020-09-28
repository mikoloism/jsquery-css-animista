(function($){
	$.chage = function( rootNode, props ){
		let rendered = checker( props );
		$(rootNode).replaceWith( rendered );

		function checker( props ){
			let rendered = '', index = 1, rowItem = false;
			Object.keys(props).forEach( item => {
				if( item === 'row' ){
					rowItem = true;
					Object.keys(props[item]).forEach( i => {
						if( i === 'textbox' ){ rendered += `<div class="section">${textbox( props[item][i], index )}</div>`; }
						if( i === 'switch' ){ rendered += `<div class="section">${switcher( props[item][i], index )}</div>`; }
					});
				}else{
					if( item === 'textbox' ){ rendered += textbox( props[item], index ); }
					if( item === 'switch' ){ rendered += switcher( props[item], index ); }
					if( item === 'label' ){ rendered += `<label>${props[item]?.text}</label>`; }
				}
				index += 1;
			});
			console.log( rendered, props );
			return rendered;
		}
	};

	function row( element ){
		return(`<div class="section">${ element }</div>`);
	}

	// built-in elements
	function switcher( props, tabIndex = (props?.tabIndex || props?.tabindex || props['tab-index'] || 0) ){
		return(`
			<label tabIndex=${tabIndex} data-form="switch">
				<input type="checkbox" checked="${props?.checked}"/>
				<span></span>
			</label>
		`);
	}
	function textbox( props, tabIndex = (props?.tabIndex || props?.tabindex || props['tab-index'] || 0) ){
		if($(`#textbox-${tabIndex}`).val() !== ''){
			$(this).addClass('show');
		}
		return(`
			<label id="textbox-${tabIndex}" tabindex="${tabIndex}" data-form="textbox">
				<input type="text" />
				<span>${ props?.placeholder }${( props?.optionally ? '(option)' : '' )}</span>
			</label>
		`);
	}
	function textarea( props, tabIndex = (0) ){
		return(`
			<textarea></textarea>
		`);
	}


}(jQuery))