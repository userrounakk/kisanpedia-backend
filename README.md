
# Kisanpedia Backend

Kisanpedia is a comprehensive platform designed to provide detailed information about various plants, their availability, sellers, and pricing. This backend is built using Node.js, Express, and MongoDB to manage and serve the data efficiently. The backend consists of five primary models: Location, Plant, Seller, Store, and User.



## Models
#### Location
This model stores information about various locations where plants and sellers are available. Each location has a unique name.
#### plant
This model stores information about different plants, including their description, image URL, locations where they are available, and their maximum retail price (MRP).
#### Seller
This model manages the sellers who offer plants. Each seller has a name, location, contact details, and a list of plants they sell.
#### Store
This model manages the store info. It has address and map location of a store.
#### User
This model manages user information. Users can manage plants and sellers, adding a layer of administration to the platform.

There are two types of users:
* Admin: Manage Plants and sellers.
* Super Admins: Manage Admins, Plants and Sellers.




## Tech Stack
* Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
* Express: A minimal and flexible Node.js web application framework.
* MongoDB: A NoSQL database for storing data in a flexible, JSON-like format.
* Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js.



## Features

- Plant Details: Provides comprehensive information about various plants, including descriptions, images, availability, and pricing.
- Seller Information: Manages and displays information about sellers, including their locations and the plants they offer.
- Store Management: Keeps track of different stores and their available plants.
- User Management: Allows users to manage the plants and sellers on the platform.


## Getting started

#### Clone the Repository

```bash
git clone https://www.github.com/userrounakk/kisanpedia-backend.git
```
    
#### Install Dependencies
```bash
npm Install
```

#### Setup Environment Variables
create a .env file in the root directory.

copy the content from .env.example and fill the required details

#### start the server
```bash
npm run dev
```





## API Reference

Postman Documentation Link: [Click Here](https://documenter.getpostman.com/view/25051977/2sA3Qtdqw6)

## Contributors

<table>
	<table>
	<tr align="center">
  <td>
		Rounak
		<p align="center">
			<img src = "https://github.com/userrounakk.png" width="150" height="150" alt="Rounak">
		</p>
			<p align="center">
				<a href = "https://github.com/userrounakk">
					<img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/>
				</a>
				<a href = "https://www.linkedin.com/in/userrounakk">
					<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
				</a>
			</p>
		</td>
        </tr>
</table>