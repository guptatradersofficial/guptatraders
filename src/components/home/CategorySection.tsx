import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sofa, BedDouble, UtensilsCrossed, Armchair, Archive, Briefcase } from 'lucide-react';

const categoryData = [
  {
    id: 'sofas',
    name: 'Sofas',
    description: 'Comfort meets style',
    icon: Sofa,
    color: 'bg-amber-100',
  },
  {
    id: 'beds',
    name: 'Beds',
    description: 'Rest in luxury',
    icon: BedDouble,
    color: 'bg-rose-100',
  },
  {
    id: 'dining',
    name: 'Dining',
    description: 'Gather in elegance',
    icon: UtensilsCrossed,
    color: 'bg-emerald-100',
  },
  {
    id: 'chairs',
    name: 'Chairs',
    description: 'Accent your space',
    icon: Armchair,
    color: 'bg-sky-100',
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Organize beautifully',
    icon: Archive,
    color: 'bg-violet-100',
  },
  {
    id: 'office',
    name: 'Office',
    description: 'Work in style',
    icon: Briefcase,
    color: 'bg-orange-100',
  },
];

export function CategorySection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold mb-4"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Find the perfect piece for every room in your home
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categoryData.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/products?category=${category.id}`}
                className="group block"
              >
                <div className="bg-card rounded-xl p-6 text-center card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full ${category.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    <category.icon className="w-7 h-7 text-foreground/70" />
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
