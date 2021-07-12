// See https://tailwindcss.com/docs/configuration for details
module.exports = {
  purge: ['./src/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        Pacifico: ['Pacifico', 'cursive'],
        Roboto: ['Roboto', 'sans-serif'], // Ensure fonts with spaces have " " surrounding it.
      },
      colors: {
        FCCorange: '#F68B1F',
        FCCblue: {
          100: '#E3F6F8',
          200: '#5AC2CD',
        },
        FCCgray: {
          100: '#999999',
          200: '#444444',
        },
      },
    },
  },
  variants: {},
  // https://github.com/tailwindcss/custom-forms
  plugins: [require('@tailwindcss/custom-forms')],
};
