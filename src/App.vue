<template>
  <v-app id="app">
    <vue-confirm-dialog></vue-confirm-dialog>
    <Navbar />
    <router-view />
  </v-app>
</template>
<script>
import Navbar from "./components/Navbar";

export default {
  components: {
    Navbar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f5f5f5;
}
html {
  background-color: #f5f5f5;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
/* Model select round labels */
.ui.fluid.dropdown {
  border-radius: 20px !important;
  z-index: 30 !important;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
/* Form floating labels */
:root {
	--input-padding-x: 1.5rem;
	--input-padding-y: 0.75rem;
}
.card-header{
  border-top-left-radius :1.5em  !important;
  border-top-right-radius : 1.5em !important;
}
.card-footer{
  border-bottom-left-radius :1.5em  !important;
  border-bottom-right-radius : 1.5em !important;
}
.form-label-group {
	position: relative;
	display: flex;
	margin-bottom: 3px;
	height: auto;
}
.form-label-group.checkbox {
	border: 1px solid #ced4da;
	border-radius: 2rem;
	padding-left: 10px;
}
.form-label-group.checkbox input {
	width: 30px;
	height: 30px;
	margin: 9px;
}
.form-label-group.checkbox label {
	position: inherit;
	width: 100%;
	padding: 10px 0;
	font-size: 16px;
}
.form-label-group input,
.form-label-group select {
	width: 100%;
	height: auto;
	border-radius: 2rem;
	z-index: 10;
	background: transparent;
}
.form-label-group input:focus,
.form-label-group select:focus {
	background: transparent !important;
}
.form-label-group>input,
.form-label-group>select,
.form-label-group>label {
    	padding: var(--input-padding-y) var(--input-padding-x);
}
.form-label-group>label {
	position: absolute;
	top: 0;
	left: 0;
	display: block;
	/* width: 100%; */
	margin-bottom: 0;
	/* Override default `<label>` margin */
	line-height: 1.5;
	color: #495057;
	border: 1px solid transparent;
	border-radius: .25rem;
	transition: all .1s ease-in-out;
}
.form-label-group input::-webkit-input-placeholder,
.form-label-group select::-webkit-select-placeholder {
	color: transparent;
}
.form-label-group input:-ms-input-placeholder,
.form-label-group select:-ms-select-placeholder {
	color: transparent;
}
.form-label-group input::-ms-input-placeholder,
.form-label-group select::-ms-select-placeholder {
	color: transparent;
}
.form-label-group input::-moz-placeholder,
.form-label-group select::-moz-placeholder {
	color: transparent;
}
.form-label-group input::placeholder,
.form-label-group select::placeholder {
	color: transparent;
}
.form-label-group input:not(:placeholder-shown) {
	padding-top: calc(var(--input-padding-y) + var(--input-padding-y) * (2 / 3));
	padding-bottom: calc(var(--input-padding-y) / 3);
}
.form-label-group input:not(:placeholder-shown)~label {
	padding-top: calc(var(--input-padding-y) / 3);
	padding-bottom: calc(var(--input-padding-y) / 3);
	font-size: 12px;
	color: #777;
}
.form-label-group select:not(:placeholder-shown) {
	padding-top: calc(var(--input-padding-y) + var(--input-padding-y) * (2 / 3));
	padding-bottom: calc(var(--input-padding-y) / 3);
}
.form-label-group select:not(:placeholder-shown)~label {
	padding-top: calc(var(--input-padding-y) / 3);
	padding-bottom: calc(var(--input-padding-y) / 3);
	font-size: 12px;
	color: #777;
}
/* Fallback for Edge
  -------------------------------------------------- */
@supports (-ms-ime-align: auto) {
	.form-label-group>label {
		display: none;
	}
	.form-label-group input::-ms-input-placeholder,
	.form-label-group select::-ms-select-placeholder {
		color: #777;
	}
}
/* Fallback for IE
  -------------------------------------------------- */
@media all and (-ms-high-contrast: none),
(-ms-high-contrast: active) {
	.form-label-group>label {
		display: none;
	}
	.form-label-group input:-ms-input-placeholder,
	.form-label-group select:-ms-select-placeholder {
		color: #777;
	}
}

/* css for date-time picker */
.date-time-group {
	position: relative;
	display: flex;
	height: auto;
}
.date-time-group input,
.date-time-group select {
	width: 100%;
	height: auto;
	border-radius: 2rem;
	z-index: 10;
	background: transparent;
}

.date-time-group .mx-input-wrapper{
	align-content: center;
}

.date-time-group input:focus,
.date-time-group select:focus {
	background: transparent !important;
}

.date-time-group input:not(:placeholder-shown) {
	padding-top: calc(var(--input-padding-y) + 4.167px/2);
	padding-bottom: calc(var(--input-padding-y)  + 4.167px/2);
}
</style>
