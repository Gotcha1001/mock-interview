import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"




import faqs from "./faqs";
import FeatureMotionWrapper from "./FramerMotion/FeatureMotionWrapperMap";
import TriangleMandalas3 from "./Mandalas/TriangleMandalas3";

const Questions = () => {
    return (
        <section id="features" className=" py-20 px-5 border mt-10 rounded-lg bg-gradient-to-r from-indigo-500 via-white to-teal-500">

            <div className="container mx-auto">
                <h3 className="text-3xl font-bold mb-12 text-center">
                    Frequently Asked Questions
                </h3>

                <Accordion type="single" collapsible>
                    {faqs.map((faq, index) => (
                        <FeatureMotionWrapper key={index} index={index}>
                            <AccordionItem className="w-full" value={`item-${index}`}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        </FeatureMotionWrapper>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export default Questions;
