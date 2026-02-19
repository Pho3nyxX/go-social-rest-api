package utils

import (
	"regexp"

	"github.com/go-playground/validator/v10"
)

var Validate *validator.Validate

func InitValidator() {
	Validate = validator.New()

	Validate.RegisterValidation("hasletter", func(fl validator.FieldLevel) bool {
		value := fl.Field().String()
		hasLetter := regexp.MustCompile(`[a-zA-Z]`)
		return hasLetter.MatchString(value)
	})
}
