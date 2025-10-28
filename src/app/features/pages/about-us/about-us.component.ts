import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent {
  teamMembers = [
    {
      name: 'Aparecido da Silva',
      role: 'Researcher',
      photo: 'assets/images/foto-cinza.jpg',
      githubLink: 'https://github.com/studioinformatica',
    },
    {
      name: 'Caroline Muniz Neves Tonon',
      role: 'Product Manager',
      photo: 'assets/images/carolina.jpg',
      linkedinLink: 'https://www.linkedin.com/in/caroline-tonon-8b991351',
      githubLink: 'https://github.com/carolinemnt',
    },
    {
      name: 'Gênesis Muniz Neves',
      role: 'Product Owner',
      photo: 'assets/images/genesis.jpg',
      linkedinLink: 'https://www.linkedin.com/in/genesisneves',
    },
    {
      name: 'Guilherme Celestino de Lima',
      role: 'Researcher',
      photo: 'assets/images/guilherme.jpeg',
      githubLink: 'https://github.com/gcelestinodelima',
    },
    {
      name: 'Lais Fernandes Daniel',
      role: 'Full Stack Developer',
      photo: 'assets/images/lais.jpeg',
      linkedinLink: 'https://www.linkedin.com/in/laisfd/',
      githubLink: 'https://github.com/laisferdan',
    },
    {
      name: 'Lucas Coraça Germano',
      role: 'Researcher',
      photo: 'assets/images/lucas.jpeg',
      linkedinLink: 'https://www.linkedin.com/in/lucas-c-germano-21a69b252',
      githubLink: 'https://github.com/lucascgmermano',
    },
    {
      name: 'Sergio Alves de Lima Junior ',
      role: 'Researcher',
      photo: 'assets/images/foto-cinza.jpg',
      githubLink: 'https://github.com/sergioalimajr',
    },
  ];
}
