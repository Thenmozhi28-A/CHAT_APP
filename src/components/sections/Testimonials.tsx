import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechCorp",
      content: "nxtReach transformed our customer engagement. We saw a 300% increase in response rates within the first month.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "E-commerce Manager",
      company: "ShopHub",
      content: "The AI automation is incredible. It feels like having a dedicated team working 24/7 to engage our customers.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "CEO",
      company: "GrowthLabs",
      content: "Best investment we've made for our business. The ROI is outstanding and the platform is so easy to use.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Sales Lead",
      company: "ConnectPro",
      content: "Game-changer for our sales process. Automated follow-ups have never been this effective and personal.",
      rating: 5
    },
    {
      name: "Lisa Park",
      role: "Customer Success",
      company: "StartupHub",
      content: "Implementation was seamless and the results were immediate. Our customer satisfaction scores jumped by 45%.",
      rating: 5
    }
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);

    // Auto-scroll
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => {
      clearInterval(intervalId);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="testimonials" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent text-white">
              Loved by Forward-Thinking
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Businesses Worldwide
            </span>
          </h2>
        </motion.div>

        <div className="relative overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative p-8 rounded-3xl h-full border transition-all duration-500 ${
                    selectedIndex === index % testimonials.length
                      ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30 shadow-2xl shadow-purple-500/10'
                      : 'bg-white/5 border-white/10 opacity-50 grayscale scale-95'
                  }`}
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-purple-400 text-purple-400" />
                    ))}
                  </div>

                  <p className="text-lg text-gray-300 mb-8 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role} @ {testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              type="button"
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedIndex === index ? 'w-8 bg-purple-500' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
