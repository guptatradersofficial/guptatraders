
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact info matches About.tsx
  const contactInfo = {
    address: 'Infront of Ram Janki mandir, mahadeva road, ara. 802301',
    phone: '+91 9470071791',
    email: 'guptatradersofficials@gmail.com',
    hours: 'Mon - Sat: 9:00 AM - 8:00 PM\nSun: 9:00 AM - 8:00 PM'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for now since we don't have a backend endpoint yet
    // In a real app, you would POST to an API
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
          title: "Message sent!",
          description: "We'll get back to you as soon as possible.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50">
        {/* Helper/Hero Section */}
        <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-12 md:py-20 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Have questions about our furniture or delivery? We're here to help. Reach out to us using the form below or visit our showroom.
                </p>
            </div>
        </div>

        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-6">
                <Card className="border-none shadow-md">
                    <CardContent className="p-6 space-y-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="bg-primary/10 p-3 rounded-full shrink-0">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Our Showroom</h3>
                                        <p className="text-gray-600 leading-relaxed">{contactInfo.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="bg-primary/10 p-3 rounded-full shrink-0">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                                        <p className="text-gray-600">{contactInfo.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="bg-primary/10 p-3 rounded-full shrink-0">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                        <p className="text-gray-600">{contactInfo.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="bg-primary/10 p-3 rounded-full shrink-0">
                                        <Clock className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                                        <div className="text-gray-600 whitespace-pre-line leading-relaxed">{contactInfo.hours}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Map */}
                <div className="h-[300px] bg-gray-100 rounded-xl overflow-hidden shadow-md border border-gray-200">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14399.378657788!2d84.656875!3d25.554167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398d5f586940656d%3A0xb3280562e153f546!2sAra%2C%20Bihar!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Showroom Location"
                    ></iframe>
                </div>
            </div>

            {/* Contact Form */}
            <div className="h-full">
                <Card className="border-none shadow-md h-full">
                    <CardContent className="p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold mb-2">Send us a Message</h2>
                            <p className="text-gray-600">Fill out the form below and we'll reply within 24 hours.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                                <Input 
                                    id="name" 
                                    name="name" 
                                    placeholder="Enter your name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                                <Input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                                <Input 
                                    id="subject" 
                                    name="subject" 
                                    placeholder="What is this about?" 
                                    value={formData.subject} 
                                    onChange={handleChange} 
                                    required 
                                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                                <Textarea 
                                    id="message" 
                                    name="message" 
                                    placeholder="How can we help you?" 
                                    rows={8}
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    required 
                                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full text-lg py-6" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : (
                                    <>
                                        Send Message <Send className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}
