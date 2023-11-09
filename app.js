Vue.component('custom-input', {
	props: [
		'type',
		'errorTitle',
		'placeholder',
	],
	
	data() {
		return {
			value: '',
			isError: false,
		}
	},
	
	methods: {
		changeInput(e) {
			this.$emit('input-value', this.value)
		},
		
		checkIsError() {
			this.value
				? this.isError = false
				: this.isError = true
		}
	},
	
	template: '<div class="form-item" >' +
		'<input :type="type" :class="{error: isError}"' +
		' v-model="value"' +
		' :placeholder="placeholder"' +
		' required tabindex="0"' +
		' @focus="isError = false"' +
		' @blur="checkIsError" v-on:input="changeInput"' +
		'/>' +
		'<span class="error-text" v-if="isError">{{errorTitle}}</span>' +
		'</div>'
	
})

Vue.component('custom-select', {
	props: [
		'selectTitle',
		'options',
		'optionValue',
	],
	
	data() {
		return {
			selected: this.selectTitle
				? this.selectTitle
				: this.options.length > 0
					? this.options[0]
					: null,
			open: false,
			isError: false,
		}
	},
	
	methods: {
		blurCheckError() {
			if(this.optionValue) {
				this.isError = false
			} else {
				this.isError = true
			}
			this.open = false
		},
	},
	
	template: '<div class="custom-select" :tabindex="0" @blur="blurCheckError" >\n' +
		'    <div class="selected" :class="{ open: open, error: isError }"  @click="open = !open" >\n' +
		'      {{ selected }}\n' +
		'    </div>\n' +
		'    <div class="items" :class="{ selectHide: !open }">\n' +
		'      <div\n' +
		'        v-for="(option, i) of options"\n' +
		'        :key="i"\n' +
		'        @click="\n' +
		'          selected = option.name;\n' +
		'          open = false; isError = false\n' +
		'          $emit(\'input-option\', option.value);\n' +
		'        "\n' +
		'      >\n' +
		'        {{ option.name }}\n' +
		'      </div>\n' +
		'    </div>' +
		'  <div v-if="isError" class="error-text">Выебрите должность</div>\n' +
		'  </div>'
	
})

var app = new Vue({
	el: '#app',
	data: {
		name: '',
		email: '',
		optionValue: null,
		firstPassword: '',
		secondPassword: '',
		checkbox: true,
		switchValue: true,
		successFetchData: false,
		
		options: [
			{value: 1, name: 'Водитель'},
			{value: 2, name: 'Повар'},
			{value: 3, name: 'Инженер'},
			{value: 4, name: 'Менеджер'},
		],
		
		isErrorEmail: false,
		isFullError: false,
		isLoading: false
	},
	methods: {
		checkOptionValue(value) {
			this.optionValue = value
		},
		getNameValue(value) {
			this.name = value
			
		},
		getFirstPasswordValue(value) {
			this.firstPassword = value
		},
		
		getSecondPasswordValue(value) {
			this.secondPassword = value
		},
		
		validateEmail() {
			if(/^[^@]+@\w+(\.\w+)+\w$/.test(this.email)) {
				this.isErrorEmail = false;
			} else {
				this.isErrorEmail = true;
			}
		},
		
		fetchFormData(e) {
			e.preventDefault()
			if(this.checkbox && this.name && this.email && this.optionValue && this.firstPassword && this.secondPassword) {
				this.isLoading = true
				setTimeout(async () => {
					this.successFetchData = true
					
					try {
						const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
							method: 'POST',
							body: JSON.stringify({
								public: this.checkbox,
								username: this.name,
								role: this.optionValue,
								email: this.email,
								password: this.firstPassword,
								password_repeat: this.secondPassword,
								
							}),
							headers: {
								'Content-type': 'application/json; charset=UTF-8',
							},
						})
							.then((response) => response.json())
							.then((json) => console.log(json, 'Отправление данных'));
					} catch(e) {
					}finally {
						this.isLoading = false
					}
					
					this.isLoading = false
				}, 2000)
			} else {
				this.isFullError = true
			}
		}
		
	},
	computed: {}
})