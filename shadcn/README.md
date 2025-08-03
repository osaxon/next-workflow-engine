# Workflow Example with React Flows, Next.js & Shadcn

This is a sample project that demonstrates how to build and visualize interactive workflows using React Flows, Next.js, and Shadcnui. The project includes validation for incomplete flows and provides modular components for easy future node creation.

## Screenshots

![App Screenshot](https://github.com/nobruf/shadcn-next-workflows/blob/main/public/screen.jpeg?raw=true)

## ✨ Features

- **Predefined Nodes**:
  - `Start`: The starting point of the workflow.
  - `Menu`: A node for selecting options.
  - `Text Message`: Displays a text message.
  - `Tags`: Node to assign specific tags.
  - `End`: The endpoint of the workflow.

- **Flow Validation**: The system automatically checks if all nodes are properly connected. Incomplete workflows cannot be completed.

- **Modular Components**: Easy-to-use components to add new nodes in the future, ensuring scalability.

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js (v14.x or higher)
- npm (v6.x or higher)

### Installation

- **Clone the repository**:
   ```bash
   git clone https://github.com/nobruf/shadcn-next-workflows.git``

- **Install dependencies**:
   ```bash 
   npm install
- **Run the development server**:
   ```bash 
   npm run dev
Open http://localhost:3000 in your browser to view the application.


## 🛠️ How to Use

- **Creating Workflows**: Start by adding nodes (`Start`, `Menu`, `Text Message`, `Tags`, `End`) to the canvas.
- **Connecting Nodes**: Drag and drop connections between the nodes to build your flow.
- **Validation**: Ensure all nodes are connected properly. The system will prevent incomplete flows from being finished.

## 🔮 Future Enhancements

- Easy node creation using modular components.
- Custom nodes can be added by following the component structure provided.

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

- Fork the Project.
- Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
- Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
- Push to the Branch (`git push origin feature/AmazingFeature`).
- Open a Pull Request.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
