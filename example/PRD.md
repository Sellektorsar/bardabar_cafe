# Product Requirements Document for Бар-да-бар

## App Overview
- Name: Бар-да-бар
- Tagline: Уютная атмосфера, изысканная кухня
- Category: cms_website
- Visual Style: Neo-Industrial Minimalism (e.g. Teenage Engineering)

## Workflow

1. User visits the website and navigates through different sections (home, menu, events, etc.).\n2. User can browse menu items by category and view details.\n3. User can view upcoming events and get information about them.\n4. User can make table or banquet reservations by filling out a contact form.\n5. User can find contact information and location details.\n6. Restaurant admin can update menu items, events, and other content through a backend system.

## Application Structure


### Route: /

Homepage featuring a hero section with restaurant images, promotional banners for events and special offers, latest news section, and quick links to menu categories. Includes navigation to all other sections and a footer with contact information.


### Route: /menu

Interactive menu page with categories (European/Italian cuisine, Pizza, Sushi, Burgers, etc.) displayed as tabs. Each menu item includes image, description, price, and an option to view details. Features elegant hover effects and smooth transitions between categories.


### Route: /events

Events page showcasing upcoming events with date, time, images, and descriptions. Events are displayed in a visually appealing grid layout with filtering options. Each event card has hover effects and can be clicked to view more details.


## Potentially Relevant Utility Functions

### requestMultimodalModel

Potential usage: For generating optimized images and content for the website

Look at the documentation for this utility function and determine whether or not it is relevant to the app's requirements.


----------------------------------

### upload

Potential usage: For uploading and storing media files like menu item photos and event images

Look at the documentation for this utility function and determine whether or not it is relevant to the app's requirements.

## External APIs
- Google Maps API
  - Usage: To display the restaurant's location on the contact page with an interactive map

## Resources
- Orero Website (reference_site): https://cafe-orero.ru/
- Bar-da-bar Address and Contact (other): https://2gis.ru/saratov/firm/70000001006372901


## Additional Considerations



### Website/Landing Page-Specific Considerations
This app has been classified as a website/landing page, so please consider the following:
- Optimize the website, first and foremost, for mobile web. Ensure that the website is fully responsive.
- Utilize any provided resources (images, navigation URLs, etc.) from the ## Resources section exactly as they are, rather than creating placeholder content when available.
- Consider that website content such as images, tables, and static text can be directly embedded in the frontend components
- If the website would benefit from placeholder content AND no specific content sources (e.g. a source URL) has already been provided by the user, create an idempotent seed script that populates content-related tables (e.g. blog posts). You can make use of the requestMultimodalModel function from ~/server/actions to generate relevant, visually appealing placeholder images. Make sure the frontend is updated to fetch this data from the database rather than hardcoding it. Do NOT create a seed script if the user has provided specific content to use, such as in website clone requests or when resources are provided.
- Write an admin setup endpoint in `api.ts`: This endpoint (e.g. `_makeUserAdmin`) should upsert the current authenticated user (`getUserId`) as an admin.
- Use the runRpcEndpoint tool to invoke the `_makeUserAdmin` RPC method to update the user's admin status. This must be called with `onBehalfOfCurrentUser: true`.
- Create an admin dashboard that makes sense given the project's purpose. For example, a personal or company website might have a dashboard for managing blog posts, images and other cotent. It might also include basic analytics and settings.
- Verify Secure Dashboard Access: Confirm that the dashboard is only visible to users with admin status (e.g., an endpoint `ensureAdminAccess` that uses `getUserId` with `throwIfNotLoggedIn: true`).
- Confirm that there's a way to navigate to the admin dashboard from the main app. The navigation UI should be conditionally rendered based on the user's admin status (e.g. via an endpoint named `getAdminStatus`). It is very important that this endpoint uses `getUserId` with `throwIfNotLoggedIn: false` to ensure that non-authenticated users will not be prompted to login in order to view the website. Failing to do so will break the experience for many websites.