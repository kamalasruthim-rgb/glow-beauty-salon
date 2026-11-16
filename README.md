# Glow Salon Hub

Build a modern, responsive, and elegant beauty salon website called "Glow Beauty Salon" for a small beauty parlor owner.

Tech Stack

 Frontend: HTML, CSS, JavaScript

 Backend: Python Flask

 Database: SQLite

 Mobile-friendly and responsive design

Website Theme

 Soft pink, white, gold, and lavender color palette

 Elegant beauty and spa-inspired design

 Smooth animations and modern UI

 Professional look suitable for a local beauty salon

Pages Required

1. Home Page

 Hero section with salon banner image

 Heading: "Enhance Your Natural Beauty"

 Subheading: "Professional Beauty Services for Every Occasion"

 Call-to-Action Buttons:

 Book Appointment

 View Services

 Customer testimonials section

 Featured services section

 Beauty tips section

2. About Us Page

 Salon story

 Mission and vision

 Meet our beauty experts

 Salon interior gallery

3. Services Page

Display services with images, descriptions, duration, and pricing.

Categories:

 Hair Styling

 Hair Coloring

 Facial Treatments

 Bridal Makeup

 Party Makeup

 Manicure

 Pedicure

 Eyebrow Threading

 Waxing

 Spa Services

Include:

 Service Name

 Price

 Duration

 Book Now button

4. Appointment Booking Page

Booking Form:

 Customer Name

 Phone Number

 Email

 Service Selection

 Preferred Date

 Preferred Time

 Additional Notes

Store bookings in SQLite database.

Admin receives booking notification on dashboard.

5. Gallery Page

 Before and After transformations

 Bridal makeup photos

 Hair styling photos

 Facial treatment results

 Masonry gallery layout with lightbox

6. Testimonials Page

 Customer reviews

 Star ratings

 Add review form

7. Contact Page

 Contact Form

 Phone Number

 WhatsApp Button

 Email Address

 Google Maps Embed

 Business Hours

Admin Dashboard

Secure Admin Login

Features:

 View Appointments

 Manage Services

 Add/Edit/Delete Services

 View Customer Reviews

 Manage Gallery Images

 Dashboard Statistics:

 Total Appointments

 Total Services

 Total Reviews

Database Tables

Users

 id

 username

 password

Services

 id

 service_name

 description

 price

 duration

 image

Appointments

 id

 customer_name

 phone

 email

 service_id

 booking_date

 booking_time

 notes

 status

Reviews

 id

 customer_name

 rating

 review_text

 created_at

Gallery

 id

 image_path

 category

Additional Features

 WhatsApp booking integration

 Email confirmation after appointment booking

 Search services

 Service filtering by category

 Responsive navigation menu

 Social media links

 Instagram feed section

 SEO-friendly structure

 Loading animations

 Form validation

 Flash messages for success/error notifications

Design Requirements

 Premium salon look

 Large hero images

 Modern cards

 Rounded buttons

 Elegant typography

 Smooth hover effects

 Attractive booking form

 Professional admin dashboard

Generate complete Flask project structure including:

 app.py

 templates folder

 static folder

 CSS

 JavaScript

 SQLite database integration

 Admin authentication

 CRUD operations

 Responsive design

The final website should be production-ready and suitable for a real beauty salon business accepting online appointments.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://glow-beauty-salon.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0044312d-a6f4-4dfc-bb3b-561bbdd846b5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
