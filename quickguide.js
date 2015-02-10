<!DOCTYPE HTML>
<html>
<head>
<meta charset="UTF-8">
<style type="text/css">

</style>
</head>
<body>

	<p>BV: <a href='#bv1' id='bv1'><b>1</b></a>, <a href='#bv2' id='bv2'>2</a>, <a href='#bv3' id='bv3'>3</a></p>
	<div id="main"></div>

<script src="jquery-1.8.3.js"></script>
<script src="underscore.js"></script>
<script src="backbone.js"></script>
<script src="backbone-faux-server.js"></script>

<script type="text/template" id="UT_1">
	<% /* template's default 'obj' overridden by 'data' in BV_1 */ %>
	<p>UT 1</p>
	obj.a_1: <%= data.a_1 %><br>
	<% if(data){
		_.each(data, function(value, key, list){
			%>
			<%=key%> : <%=value%><br>
			<%
		})
	} %>
</script>

<script type="text/template" id="UT_2">
	<p>UT 2</p>
	obj.a_1: <%= obj.a_1 %><br>
	<% if(obj){
		_.each(obj, function(value, key, list){
			%>
			<%=key%> : <%=value%><br>
			<%
		})
	} %>
</script>

<script type="text/template" id="UT_3">
	<p>UT 3</p>
	Sample template 3
</script>

<script type="text/javascript">


/******************************************/
	var BM_1 = Backbone.Model.extend({
		defaults: {
			a_1: 'v_1', a_2: 'v_2'
		},
		idAttribute: 'a_id',
		urlRoot: 'library/books',
		initialize: function(){
			console.log('BM_1 initialize() called');
			this.on({
				'change': function(){
					console.log('BM_1 change() called');
				},
				'change:a_2': function(){
					console.log('BM_1.a_2 change() called');
				},
				'invalid': function(model, error){
					console.log('BM_1 invalid() called');
					console.warn(error);
				}
			});
		},
		validate: function(attrs){
			console.log('BM_1 validate() called');
			if(!attrs.a_1){
				//validation failed
				return 'BM_1.a_1 attr is required';
			}
			if(attrs.a_1){
				console.log('BM_1.a_1 attr is set');
			}
		}
	});

	console.info('BM_1 Starts...');
	var bm_1_1 = new BM_1();
	console.log(bm_1_1);
	console.log('bm_1_1 => ' + JSON.stringify(bm_1_1));

	var bm_1_2 = new BM_1({a_id: 2, a_1: 'v_11', a_3: 'v_3'});
	console.log(bm_1_2);
	console.log(bm_1_2.toJSON());

	console.log('bm_1_2.a_3 => ' + bm_1_2.get('a_3'));

	bm_1_2.set({a_1: 'v_111', a_4: 'v_4'});
	console.log('bm_1_2 => ' + JSON.stringify(bm_1_2));
	//bm_1_2.save();

	bm_1_2.set('a_2','v_22');
	console.log('bm_1_2 => ' + JSON.stringify(bm_1_2));

	bm_1_2.unset('a_1', {validate: true});
	console.warn('bm_1_2.validationError => ' + bm_1_2.validationError);
	bm_1_2.set('a_1','v_1111', {validate: true});
	console.warn('bm_1_2.validationError => ' + bm_1_2.validationError);
	console.log('bm_1_2 => ' + JSON.stringify(bm_1_2));

	//does not trigger validate
	bm_1_2.attributes.a_1 = 'v_11111';
	console.log('bm_1_2 => ' + JSON.stringify(bm_1_2));


/******************************************/
	var BC_1 = Backbone.Collection.extend({
		model: BM_1,
		url: 'library/books',
		initialize: function(){
			console.log('BC_1 initialize() called');
			this.on({
				'add': function(){
					console.log('BC_1 add() called');
				},
				'remove': function(){
					console.log('BC_1 remove() called');
				},
				'change': function(){
					console.log('BC_1 change() called');
				}
			});
		}
	});

	console.info('BC_1 Starts...');
	var bc_1_1 = new BC_1([bm_1_1, bm_1_2]);
	console.log(bc_1_1);
	console.log(bc_1_1.models);
	var bm_1_3 = new BM_1({id: 3});
	bc_1_1.add(bm_1_3);
	//merge:true causes duplicate models to have their attributes merged in to existing models.
	//bc_1_1.add(bm_1_3, {merge: true});
	console.log(bc_1_1.models);
	bc_1_1.remove([bm_1_1, bm_1_2]);
	//bc_1_1.remove(bm_1_2);
	console.log(bc_1_1.models);
	console.log('bc_1_1.length => ' + bc_1_1.length);
	console.log(bc_1_1.get('c4')); //retrieve model using 'cid'
	console.log(bc_1_1.get(3)); //retrieve model using 'id'
	console.log(bc_1_1.get('c3')); //retrieve model using 'cid'
	var bm_1_4 = new BM_1({a_id: 4});
	bc_1_1.add(bm_1_4);
	console.log('bc_1_1.length => ' + bc_1_1.length);
	console.log(bc_1_1.get(4)); //retrieve model using 'idAttribute'
	bc_1_1.set([{a_id: 4, a_1: 'v_11', a_2: 'v_22'}]);
	console.log(bc_1_1.models);
	console.log('bc_1_1.length => ' + bc_1_1.length);


/******************************************/
	var BV_1 = Backbone.View.extend({
		//new element will be created by framework and a reference to it will be available at the el property. If nothing is specified tagName defaults to div.
		//tagName: 'li',
		//el: 'CSSElementSelector',
		id: 'ID_1',
		className: 'CLASS_1',
		//template's default obj overridden by data
		template: _.template($('#UT_1').html(), null, {variable: 'data'}),
		events: {
			'event selector': 'handler'
		},
		initialize: function(){
			console.log('BV_1 initialize() called');
			console.log(this.template.source);
			this.render();
		},
		render: function(){
			console.log('BV_1 render() called');
			this.$el.html(this.template(this.model.toJSON()));
			this.custom_1();
    		return this;
		},
		custom_1: function(){
			console.log('BV_1 custom_1() called');
			this.custom_2();
		},
		custom_2: function(){
			console.log('BV_1 custom_2() called');
		}
	});

	console.info('BV_1 Starts...');
	var bv_1_1 = new BV_1({model: bm_1_2});
	//var bv_1_1 = new BV_1({el: $('selector')});
	//to apply an existing Backbone view to a different DOM element
	//bv_1_1.setElement($('selector'));
	console.log(bv_1_1);
	console.log(bv_1_1.el.outerHTML);
	console.log(bv_1_1.render().el.outerHTML);
	//$('#main').html(bv_1_1.render().el); //moved to router changeView()
	

/******************************************/
	var BV_2 = Backbone.View.extend({
		id: 'ID_2',
		className: 'CLASS_2',
		//template's default obj overridden by data
		template: _.template($('#UT_2').html()),
		events: {
			'event selector': 'handler'
		},
		initialize: function(){
			console.log('BV_2 initialize() called');
			this.render();
		},
		render: function(){
			console.log('BV_2 render() called');
			this.$el.html(this.template(this.model.toJSON()));
    		return this;
		}
	});

	console.info('BV_2 Starts...');
	var bv_2_1 = new BV_2({model: bm_1_1});
	console.log(bv_2_1);
	//$('#main').html(bv_2_1.render().el); //moved to router changeView()
	console.info('End of RnD.');


/******************************************/
	var BR_1 = Backbone.Router.extend({
		routes: {
			"": "intiApp",
			"bv:id": "changeView",
			"*other": "defaultRoute"
		},
		intiApp: function(){
			console.log('start of the app');
		},
		changeView: function(id){
			console.log('You attempted to reach: bv_' + id + '_1');
			$('#main').html(eval('bv_'+id+'_1').render().el);
		},
		defaultRoute: function(other){
        	console.log('Invalid attempt to reach:' + other);
	    }
	});

	var br_1_1 = new BR_1();
	Backbone.history.start();
	//var listView = listView || new ListView();


/******************************************/
	fauxServer.addRoutes({
	    createBook: {
	        urlExp: "library-app/books",
	        httpMethod: "POST",
	        handler: function (context) {
	        	console.log('FS POST() called');
	            // Create book using attributes in context.data
	            // Save to persistence layer
	            // Return attributes of newly created book
	        }
	    },
	    readBooks: {
	        urlExp: "library-app/books",
	        httpMethod: "GET",
	        handler: function (context) {
	        	console.log('FS GET() called');
	            // Return array of stored book attributes
	            return [{_id: 1, title: 'Harry Potter', author: 'Rollings'},
	            		{_id: 2, title: 'Lost World', author: 'Spielberg'},
	            		{title: 'Gladiator', author: 'Woods'}];
	        }
	    },
	    readBook: {
	        urlExp: "library-app/books/:id",
	        httpMethod: "GET",
	        handler: function (context, bookId) {
	        	console.log('FS GET() called');
	            // Return attributes of stored book with id 'bookId'
	        }
	    },
	    updateBook: {
	        urlExp: "library-app/books/:id",
	        httpMethod: "PUT",
	        handler: function (context, bookId) {
	        	console.log('FS PUT() called');
	            // Update stored book with id 'bookId', using attributes in context.data
	            // Return updated attributes
	        }
	    },
	    patchBook: {
	        urlExp: "library-app/books/:id",
	        httpMethod: "PATCH",
	        handler: function (context, bookId) {
	        	console.log('FS PATCH() called');
	            // Update stored book with id 'bookId', using attributes in context.data
	            // Return updated attributes
	        }
	    },
	    deleteBook: {
	        urlExp: "library-app/books/:id",
	        httpMethod: "DELETE",
	        handler: function (context, bookId) {
	        	console.log('FS DELETE() called');
	            // Delete stored book of id 'bookId'
	        }
	    }
	});

/*
Method	HTTP	BB			URL
----------------------------------------
create	post	c.create	c.url
read	get		c.fetch		c.url
read	get		c.fetch		c.url/:id
update	put		m.save		c.url/:id
update	patch	m.save		c.url/:id
delete	delete	m.destroy	c.url/:id
*/

	var Book = Backbone.Model.extend({
	    defaults: {
	        title: "Unknown title",
	        author: "Unknown author"
	    },
	    idAttribute: '_id'
	});
	var Books = Backbone.Collection.extend({
	    model: Book,
	    url: "library-app/books"
	});

	var mybooks = new Books();
	mybooks.fetch();
	var mybook = mybooks.get(2);
	var mybook2 = mybooks.get('c10');
	mybook.set('a_1','vv_111_m');
	mybook2.set('a_1','vv_111_m');
	console.log(mybook.isNew());
	mybook.save();
	console.log(mybook2.isNew());
	mybook2.save();
	mybook.save({a_1: 'vv_111_mm'},{patch: true});
	mybook.destroy();
	mybooks.create({title: 'Try out code samples'});

</script>
</body>
</html>	
