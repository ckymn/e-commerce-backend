module.exports = (name, default_value=null) => {
	return process.env[name] || default_value;
} 