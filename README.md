# DevOps Pipeline Generator

A comprehensive MERN stack web application that helps DevOps engineers, cloud professionals, and students automatically generate production-ready configuration files for various DevOps tools.

## 🚀 Features

- **🔐 Authentication System**: JWT-based authentication with role-based access control
- **🧠 Smart Generator Dashboard**: Clean, modern UI with sidebar navigation
- **⚙️ Dynamic Form Builder**: Dynamic forms for each DevOps service
- **🏗️ Code Generation Engine**: Production-ready code templates for:
  - Jenkins Pipeline (Jenkinsfile)
  - GitHub Actions YAML workflows
  - Ansible Playbooks
  - Kubernetes YAML (Deployment, Service, Ingress)
  - Terraform configuration files
- **📄 Output Viewer**: Monaco Editor with syntax highlighting
- **📁 Save & History**: Save generated configurations to MongoDB
- **🌐 REST API**: Well-designed API endpoints
- **🎨 Professional UI/UX**: Modern design with dark mode support
- **🐳 Docker Ready**: Complete Docker configuration

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Validation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Monaco Editor** - Code editor
- **Lucide React** - Icons

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📦 Project Structure

```
devops-pipeline-generator/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── context/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 7.0+
- Docker & Docker Compose (optional)

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devops-pipeline-generator
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:5001
   - MongoDB: localhost:27017

### Manual Setup

1. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

3. **Start MongoDB**
   ```bash
   mongod
   ```

4. **Start the services**
   ```bash
   # Backend (in terminal 1)
   cd backend
   npm run dev
   
   # Frontend (in terminal 2)
   cd frontend
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Generation
- `POST /api/generate/jenkins` - Generate Jenkins pipeline
- `POST /api/generate/github-actions` - Generate GitHub Actions
- `POST /api/generate/ansible` - Generate Ansible playbook
- `POST /api/generate/kubernetes` - Generate Kubernetes YAML
- `POST /api/generate/terraform` - Generate Terraform config
- `GET /api/generate/templates` - Get available templates

### History
- `GET /api/history` - Get user's file history
- `GET /api/history/:id` - Get specific file
- `PUT /api/history/:id` - Update file metadata
- `DELETE /api/history/:id` - Delete file
- `POST /api/history/:id/duplicate` - Duplicate file

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/devops-pipeline-generator
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

#### Frontend
```env
VITE_API_URL=http://localhost:5001/api
```

## 🎯 Usage

1. **Register/Login**: Create an account or login to existing one
2. **Choose Generator**: Select from the available generators in the dashboard
3. **Fill Form**: Complete the dynamic form with your project details
4. **Generate**: Click generate to create your configuration files
5. **View & Download**: View the generated code in Monaco editor and download
6. **Save**: Save configurations to your history for later access

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting
- CORS protection
- Security headers
- Non-root Docker containers

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Deployment

### Production Deployment

1. **Build and deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Configure reverse proxy** (nginx/Apache)
3. **Set up SSL certificates**
4. **Configure environment variables**
5. **Set up monitoring and logging**

### Environment Variables for Production
- Use strong JWT secrets
- Configure proper MongoDB credentials
- Set up proper CORS origins
- Enable HTTPS
- Configure logging levels

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🎉 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Monaco Editor for the code editing capabilities
- MongoDB for the flexible database solution
