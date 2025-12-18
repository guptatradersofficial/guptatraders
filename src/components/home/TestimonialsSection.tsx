import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'New Delhi',
    rating: 5,
    text: 'Absolutely love my new sofa from Gupta Traders! The quality is exceptional and the delivery was super fast. Highly recommend!',
    product: 'Terracotta Modern Sofa',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Mumbai',
    rating: 5,
    text: 'The dining set exceeded my expectations. Beautiful craftsmanship and the wood quality is top-notch. Worth every rupee!',
    product: 'Nordic Oak Dining Set',
  },
  {
    id: 3,
    name: 'Anita Desai',
    location: 'Bangalore',
    rating: 5,
    text: 'Great customer service and the furniture is stunning. My living room looks completely transformed. Thank you!',
    product: 'Velvet Accent Armchair',
  },
];

export function TestimonialsSection() {
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
            What Our Customers Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Join thousands of happy customers who have transformed their homes with us
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 card-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-card-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location} • Purchased {testimonial.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
