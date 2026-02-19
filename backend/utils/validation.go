/*
package utils

import "regexp"

	func ValidateUsername(username string) string {
		if username == "" {
			return "Username is required"
		}

		if len(username) < 3 || len(username) > 20 {
			return "Username must be 3–20 characters"
		}

		hasLetter := regexp.MustCompile(`[a-zA-Z]`)
		if !hasLetter.MatchString(username) {
			return "Username must contain at least one letter"
		}

		validCharacters := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
		if !validCharacters.MatchString(username) {
			return "Only letters, numbers, and underscores allowed"
		}

		if regexp.MustCompile(`^_|_$`).MatchString(username) {
			return "Username cannot start or end with underscore"
		}

		return ""
	}

	func ValidateEmail(email string) string {
		if email == "" {
			return "Email is required"
		}

		if regexp.MustCompile(`\s`).MatchString(email) {
			return "Email cannot contain spaces"
		}

		emailRegex := regexp.MustCompile(
			`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`,
		)

		if !emailRegex.MatchString(email) {
			return "Invalid email format"
		}

		return ""
	}
*/
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
