/* Stcky Footer for Contao
 * @author: Joe Ray Gregory aka may17
 * @author: Stefan Melz (Debugbar bugfix)
 * @copyright: Joe Ray Gregory 2012 joe@may17.de
 * @license LGPL
 */
(function() {
    M17StickyFooter = {
        init: function() {

            var formBody = document.getElement('.tl_formbody_submit') || false,
                setEvent,
                fieldsets,
                debugToggler,
                self = this;

            //invoke only when the element existists
            if(formBody) {

            	this.footerData = this.generateSubmitObj(formBody);
				this.generateOffset();
                //load the methoad with init
                this.setItem();
                
               	//Prepare event
               	setEvent = this.setItem.bind(this);
               	
               	//Add resize and scroll events
                window.addEvents({
                    'scroll': setEvent,
                    'resize': setEvent,
                    'ajax_change': setEvent
                });
                
                fieldsets = $$('fieldset');
                
                //addEvent Delegation for legends
                fieldsets.addEvent('click:relay(legend)', function(e){
                    self.setItem();
                });
                
                //Improvment for checkbox actions
                fieldsets.addEvent('click:relay(input.tl_checkbox[onclick])', function(e){
                    self.setItem();
                });
                
                //Watch debug toggler
                debugToggler = document.id('tog') || false;
                if(debugToggler) {
                    debugToggler.addEvent('click',function(){
                    	self.setItem();
                	})
                }
            }
        },
        
        /* generateSubmitObj
         * @desc generates the internal footer Object
         */
        generateSubmitObj: function(formbody) {
        	var submitContainer = formbody.getFirst();
        	
        	return {
        		item: formbody,
        		submitContainer: submitContainer,
        		height: submitContainer.getHeight(),
        		width: submitContainer.getStyle('width'),
        		offset: 0
        	}
        },
        
        /* generateOffset
         * @desc calculates an offset if debug bar is active
         */
        generateOffset: function(){
			var debug = document.id('debug') || false;
			
			
            //set news offset for debugbar
            if(debug){
                var offset = debug.getElement('p').getSize().y + debug.getElement('div').getSize().y -1;
                    this.footerData.submitContainer.setStyle('bottom', offset);
                    this.footerData.offset = offset;
            }
        },
        
        /* initStickyFooter
         * @desc initialize the stickyFooter for Backend
         */
        setItem: function(formBody) {
            var offset = this.generateOffset(),
            	raffle = this.footerData.item.getPosition().y + this.footerData.height + this.footerData.offset,
            	win = window,
            	diff = raffle - win.getHeight(),
                docBody = document.body,
                stickyClass = 'stickySave',
            	scrollSizeToInt = win.getScroll().y.toInt();
            	
            if(scrollSizeToInt > diff) {
                docBody.removeClass(stickyClass);
            } else {
                //check if class set
                if(!docBody.hasClass(stickyClass)) {
                    this.footerData.submitContainer.setStyle('width', this.footerData.width);
                    docBody.addClass(stickyClass);
                }
            }
        }
    }
    window.addEvent('domready', function() {
        M17StickyFooter.init();
        this.scrollTo(0, 1);
    });
})();