import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  teamMembers = [
    {
      name: 'Caroline Muniz Neves Tonon',
      role: 'Product Manager',
      photo: 'assets/images/carolina.jpg',
      linkedinLink: 'https://www.linkedin.com/in/caroline-tonon-8b991351',
      githubLink: 'https://github.com/carolinemnt'
    },
    {
      name: 'Estela de Oliveira',
      role: 'Backend Developer',
      photo: 'assets/images/estela.jpeg',
      linkedinLink: 'https://www.linkedin.com/in/estela-oliveira-989628104',
      githubLink: 'https://github.com/estelaoliveiradev'
    },
    {
      name: 'Gênesis Muniz Neves',
      role: 'Product Owner',
      photo: 'assets/images/genesis.jpg',
      linkedinLink: 'https://www.linkedin.com/in/genesisneves',
    },
    {
      name: 'Lais Fernandes Daniel',
      role: 'Frontend Developer',
      photo: 'assets/images/lais.jpeg',
      linkedinLink: 'https://www.linkedin.com/in/laisfd/',
      githubLink: 'https://github.com/laisferdan'
    },
    {
      name: 'Lucas Coraça Germano',
      role: 'Researcher',
      photo: 'assets/images/lucas.jpeg',
      linkedinLink: 'https://www.linkedin.com/in/lucas-c-germano-21a69b252',
      githubLink: 'https://github.com/lucascgmermano'
    },
    {
      name: 'Marlúcia Damálio Carvalho',
      role: 'Researcher',
      photo: 'assets/images/marlucia.jpg',
      linkedinLink: 'https://www.linkedin.com/in/marlucia-damalio-05617a334',
    }
  ];
}