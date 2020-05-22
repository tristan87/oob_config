//generate user prompt for password confirmation
module.exports = (config, override) => {
  return [
    {
      type:     (override.credsExist || !config.continue) ? false : 'text',
      name:     'confirmPassword',
      message:  'Please enter the admin password again:',
      style:    'password',
      validate: value => (value === config.setPassword) ? true : "Passwords do not match.",
      onState:  (state) => {if(state.aborted) {config.continue = false;}}
    }
  ];
};
