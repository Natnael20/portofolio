import { Component, HostListener } from '@angular/core';
import { Project } from '../../model/project';
 
@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class Projects {

  selectedCategory = 'all';
  isScrolled = false;
  selectedProject: Project | null = null;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 30;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeProjectModal();
  }

  projects: Project[] = [
    {
      id: 1,
      title: 'Book Management',
      description: 'Full-stack CRUD application with .NET backend and Angular frontend. JWT auth, catalog management, clean architecture.',
      category: 'fullstack',
      tech: ['Angular', 'C#', '.NET', 'REST API', 'JSON'],
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
      liveUrl: 'https://litlog.netlify.app/',
      githubUrl: 'https://github.com/Natnael20/LiteraryLounge'
    },
    {
      id: 2,
      title: 'Task Manager',
      description: 'Cross-platform productivity system with Java backend, React web, and React Native mobile app.',
      category: 'fullstack',
      tech: ['Java', 'React', 'React Native', 'MySQL'],
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80',
      githubUrl: 'https://github.com/Natnael20/Task-Manager'
    },
    {
      id: 3,
      title: 'EdgeCut',
      description: 'A furniture e-commerce website with a product slider, about section, blog previews, contact form, and footer links.',
      category: 'frontend',
      tech: ['React', 'BootStrap', 'JavaScript'],
      image: 'assets/img/myreact.png',
      githubUrl: 'https://github.com/Natnael20/myreact'
    },
    {
      id: 4,
      title: 'PATO Restaurant',
      description: 'PATO is an Italian restaurant website showcasing its dining experience, cuisine, events, table reservations, and blog, with a warm, elegant design aimed at attracting diners.',
      category: 'frontend',
      tech: ['HTML5', 'CSS3', 'BootStrap', 'JavaScript'],
      image: 'assets/img/pato.png',
      liveUrl: 'https://natnael20.github.io/PATO/',
      githubUrl: '#'
    },
    {
      id: 5,
      title: 'Stride (E-commerce Website)',
      description: 'STRIDE is a footwear brand website showcasing and selling shoes across categories like running, sneakers, basketball, and casual.',
      category: 'frontend',
      tech: ['HTML5', 'CSS3', 'Bootstrap', 'Font Awesome', 'JavaScript'],
      image: 'assets/img/stride.webp',
      liveUrl: 'https://natnael20.github.io/stride/',
      githubUrl: 'https://github.com/Natnael20/stride'
    },
    {
      id: 6,
      title: 'All Food',
      description: 'AllFood is a restaurant website showcasing its menu, family-friendly offerings, table booking, and blog news, with a warm, inviting design aimed at promoting the restaurant and attracting diners.',
      category: 'frontend',
      tech: ['HTML5', 'CSS3', 'BootStrap', 'JavaScript'],
      image: 'assets/img/allfood.png',
      liveUrl: 'https://natnael20.github.io/AllFood/',
      githubUrl: 'https://github.com/Natnael20/AllFood'
    },
    {
      id: 7,
      title: 'Archs',
      description: 'Archs is an interior design and architecture website featuring services, team, pricing, projects, blog, and contact info in a clean, professional layout.',
      category: 'frontend',
      tech: ['HTML5', 'CSS3', 'BootStrap', 'JavaScript'],
      image: 'assets/img/Archs.png',
      liveUrl: 'https://natnael20.github.io/Archs/',
      githubUrl: 'https://github.com/Natnael20/Archs'
    },
    {
      id: 8,
      title: 'Montana',
      description: 'Montana is a luxury resort and hotel website featuring room offers, dining, featured rooms with pricing, and a nature-focused design aimed at attracting guests.',
      category: 'frontend',
      tech: ['HTML5', 'CSS3', 'BootStrap', 'JavaScript'],
      image: 'assets/img/montana.png',
      liveUrl: 'https://natnael20.github.io/Montana/',
      githubUrl: 'https://github.com/Natnael20/Montana'
    },
    {
      id: 9,
      title: 'Time Zone',
      description: 'Timezone is an e-commerce website showcasing watches and accessories, featuring new arrivals, popular items with prices, and featured product highlights in a modern retail layout.',
      category: 'frontend',
      tech: ['HTML5', 'CSS3', 'BootStrap', 'JavaScript'],
      image: 'assets/img/timezone.png',
      liveUrl: 'https://natnael20.github.io/timezone/',
      githubUrl: 'https://github.com/Natnael20/timezone'
    },
    {
      id: 10,
      title: 'Express',
      description: 'Express is a logistics and transport company website showcasing land, ship, and air transport services, with company info, a free quote request section, and a team section.',
      category: 'frontend',
      tech: ['HTML5', 'CSS3', 'BootStrap', 'JavaScript'],
      image: 'assets/img/express.png',
      liveUrl: 'https://natnael20.github.io/Express/',
      githubUrl: 'https://github.com/Natnael20/Express'
    },
    {
      id: 11,
      title: ' Library System',
      description: 'A Java library management system built with pure object-oriented programming, handling books, members, and lending operations.',
      category: 'backend',
      tech: ['Java', 'OOP'],
      image: 'https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TGlicmFyeXxlbnwwfHwwfHx8MA%3D%3D',
      liveUrl: '',
      githubUrl: 'https://github.com/Natnael20/LibrarySystem'
    },
    {
      id: 12,
      title: 'Employee Management',
      description: 'A Spring Boot application for employee management, built with Java and the Spring Boot framework. It provides backend functionality for handling employee records, likely including operations like adding, viewing, updating, and deleting employee data through a REST API.',
      category: 'backend',
      tech: ['Java', 'Springboot', 'REST API'],
      image: 'https://images.unsplash.com/photo-1560264357-8d9202250f21?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEVtcGxveWVlfGVufDB8fDB8fHww',
      liveUrl: '',
      githubUrl: 'https://github.com/Natnael20/EmployeeManagementBoot'
    },
    {
      id: 13,
      title: 'Parking Lot',
      description: 'A Java console-based Parking Lot Management System that provides a simple, text-driven interface for handling parking operations such as registering vehicle entry, recording exits, allocating parking spots, and calculating fees.',
      category: 'Backend',
      tech: ['Java'],
      image: 'https://images.unsplash.com/photo-1495435229349-e86db7bfa013?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHBhcmtpbmd8ZW58MHx8MHx8fDA%3D',
      liveUrl: '',
      githubUrl: 'https://github.com/Natnael20/inventoryManagementSystem'
    },
    {
      id: 14,
      title: 'Wisdom Church',
      description: 'A church and ministry website featuring Bible study, sermons, prayer requests, podcasts, upcoming events, and a newsletter signup.',
      category: 'frontend',
      tech: ['HTML5', ' CSS5', 'Javascript', 'BootStrap'],
      image: 'assets/img/wisdom.png',
      liveUrl: 'https://natnael20.github.io/Wisdom/',
      githubUrl: 'https://github.com/Natnael20/Wisdom'
    },
    {
      id: 15,
      title: 'Selling',
      description: 'An e-commerce website featuring a product catalog (hoodies and similar items), a featured product section with pricing, an about and leadership team section, a summer sale countdown, and service offerings',
      category: 'frontend',
      tech: ['HTML5', ' CSS5', 'Javascript', 'BootStrap'],
      image: 'assets/img/selling.png',
      liveUrl: 'https://natnael20.github.io/Selling/',
      githubUrl: 'https://github.com/Natnael20/Selling'
    },
    {
      id: 16,
      title: 'Airport',
      description: 'A Java console program for managing flights at LTU Airport. It lets you register scheduled and actual arrivals and departures, checks that flight numbers and times are valid, and prints a summary of all flights including which ones were delayed.',
      category: 'backend',
      tech: ['Java'],
      image: 'https://plus.unsplash.com/premium_photo-1663039978729-6f6775725f89?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWlycG9ydHxlbnwwfHwwfHx8MA%3D%3D',
      liveUrl: '',
      githubUrl: 'https://github.com/Natnael20/airportManagementSystem'
    },
    {
      id: 17,
      title: 'Inventory Management',
      description: 'A Java console program for managing inventory. It lets you add items with a name, quantity, and price, update an items quantity, search for items by name, and print the inventory sorted either by name or by quantity.',
      category: 'backend',
      tech: ['Java'],
      image: 'https://images.unsplash.com/photo-1624927637280-f033784c1279?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGludmVudG9yeXxlbnwwfHwwfHx8MA%3D%3D',
      liveUrl: '',
      githubUrl: 'https://github.com/Natnael20/inventoryManagementSystem'
    },
    {
      id: 18,
      title: 'Payroll Management',
      description: 'A Java console program for managing employee payroll. It lets you add employees with auto-generated IDs, record their monthly salary, calculate annual salary, and print employee lists sorted by name or by annual salary.',
      category: 'backend',
      tech: ['Java'],
      image: 'https://plus.unsplash.com/premium_photo-1661771004026-9e0f74a4ed39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGF5cm9sbHxlbnwwfHwwfHx8MA%3D%3D',
      liveUrl: '',
      githubUrl: 'https://github.com/Natnael20/employeePayrollSystem'
    },
    {
      id: 19,
      title: 'University System',
      description: 'A Java university system built with pure object-oriented programming, modeling the relationships between courses, students, and professors.',
      category: 'backend',
      tech: ['Java', 'OOP'],
      image: 'https://images.unsplash.com/20/cambridge.JPG?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dW5pdmVyc2l0eXxlbnwwfHwwfHx8MA%3D%3D',
      liveUrl: '',
      githubUrl: 'https://github.com/Natnael20/universitySystem'
    },
    {
      id: 20,
      title: 'IRC Chat System',
      description: 'A small-scale IRC (Internet Relay Chat) system built in Java, implementing a client-server chat architecture.',
      category: 'backend',
      tech: ['Java', 'OOP', 'TCP', 'Socket'],
      image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&q=80',
      liveUrl: '',
      githubUrl: 'https://github.com/Natnael20/IRCChatSystem'
    },
    {
      id: 21,
      title: 'Event Management',
      description: 'A RESTful backend for managing events, built with Spring Boot and MySQL. Exposes CRUD endpoints for creating, retrieving, updating, and deleting events, with clean controller-service-repository layering and JPA-based persistence.',
      category: 'backend',
      tech: ['Java', 'Spring Boot', 'MySQL', 'REST API'],
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
      liveUrl: '',
      githubUrl: 'https://github.com/Natnael20/Event'
    }
  ];

  get filteredProjects(): Project[] {
    const category = this.selectedCategory.trim().toLowerCase();

    if (category === 'all') {
      return this.projects;
    }
    return this.projects.filter(p => p.category.toLowerCase() === category);
  }

  filterCategory(category: string): void {
    this.selectedCategory = category.trim().toLowerCase();
  }

  countByCategory(category: string): number {
    const normalizedCategory = category.trim().toLowerCase();
    return this.projects.filter(p => p.category.toLowerCase() === normalizedCategory).length;
  }

  /* ================================
     PROJECT MODAL
     ================================ */
  openProjectModal(project: Project): void {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden';
  }

  closeProjectModal(): void {
    this.selectedProject = null;
    document.body.style.overflow = '';
  }
}