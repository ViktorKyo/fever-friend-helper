import React from 'react';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { slideUpAnimation } from '@/lib/animations';
import { BookOpen, AlertTriangle, Thermometer, Pill, HelpCircle, Timer, Baby, Phone } from 'lucide-react';

const Advice = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <Card className={cn("glass-morphism", slideUpAnimation(100))}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Fever Guidance
            </CardTitle>
            <CardDescription>
              Important information for managing childhood fevers
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium flex">
                  <Thermometer className="h-4 w-4 mr-2 text-primary" />
                  Understanding Fever
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-2">Fever is usually a sign that the body is fighting an infection. A temperature above these thresholds is generally considered a fever:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-2">
                    <li>Rectal, ear or temporal artery: 100.4°F (38°C) or higher</li>
                    <li>Oral: 100°F (37.8°C) or higher</li>
                    <li>Armpit: 99°F (37.2°C) or higher</li>
                  </ul>
                  <p>Keep in mind that fever ranges can vary by age and individual child.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium flex">
                  <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                  When to Seek Immediate Care
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="font-medium mb-2">Seek emergency medical attention if your child:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Is younger than 3 months and has a temperature of 100.4°F (38°C) or higher</li>
                    <li>Has a temperature above 104°F (40°C)</li>
                    <li>Has a fever and a stiff neck or severe headache</li>
                    <li>Has a fever and rash that doesn't blanch (turn white) when pressed</li>
                    <li>Is extremely lethargic, unresponsive or difficult to wake</li>
                    <li>Has difficulty breathing not due to nasal congestion</li>
                    <li>Has blue lips, tongue or skin</li>
                    <li>Has persistent vomiting or severe diarrhea</li>
                    <li>Has a seizure or convulsion</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium flex">
                  <Pill className="h-4 w-4 mr-2 text-primary" />
                  Medication Guidelines
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-2">When using over-the-counter fever reducers:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>Always follow the dosing instructions on packaging</li>
                    <li>Use the measuring device that comes with the medication</li>
                    <li>Never give aspirin to children or teenagers (risk of Reye's syndrome)</li>
                    <li>Don't give ibuprofen to infants younger than 6 months</li>
                    <li>Don't give acetaminophen to infants younger than 3 months without medical advice</li>
                    <li>Don't use both acetaminophen and ibuprofen together unless advised by a doctor</li>
                  </ul>
                  <p className="font-medium text-xs">Note: The medication dosages in this app are calculated based on weight and are meant as a general guide. Always consult with your healthcare provider for personalized advice.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium flex">
                  <Baby className="h-4 w-4 mr-2 text-primary" />
                  Age-Specific Guidance
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="font-medium mb-1">0-3 months:</p>
                  <p className="mb-2">Call your doctor immediately for any fever. Do not give medication without medical advice.</p>
                  
                  <p className="font-medium mb-1">3-6 months:</p>
                  <p className="mb-2">Call your doctor for fevers above 102°F (38.9°C). Acetaminophen can be used if approved by a doctor.</p>
                  
                  <p className="font-medium mb-1">6-24 months:</p>
                  <p className="mb-2">Call your doctor for fevers that last more than a day or reach 102°F (38.9°C). Acetaminophen or ibuprofen can be used.</p>
                  
                  <p className="font-medium mb-1">2-17 years:</p>
                  <p>Call your doctor for fevers above 102°F (38.9°C) that last more than 3 days, or if accompanied by concerning symptoms.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium flex">
                  <Timer className="h-4 w-4 mr-2 text-primary" />
                  Home Care Tips
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Keep your child hydrated with water, diluted juice, or ice pops</li>
                    <li>Dress your child in lightweight clothing</li>
                    <li>Use a light blanket if they have chills</li>
                    <li>Keep the room at a comfortable temperature</li>
                    <li>Avoid cold baths or alcohol rubs, which can cause shivering and raise temperature</li>
                    <li>Rest is important for recovery</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-medium flex">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  Talking to Your Doctor
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-2">When calling your doctor about a fever, be prepared to provide:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your child's exact temperature and how it was taken</li>
                    <li>When the fever started and if it has fluctuated</li>
                    <li>Any medications already given and the response</li>
                    <li>All other symptoms (cough, rash, vomiting, etc.)</li>
                    <li>Recent exposures to illness</li>
                    <li>Underlying medical conditions</li>
                    <li>Recent vaccinations</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left font-medium flex">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                  About This App
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-2">Fever Friend is designed to help parents track and manage childhood fevers. The advice provided is based on general medical guidelines, but should not replace professional medical care.</p>
                  <p className="text-xs font-medium">Important: This app is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions about a medical condition.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Advice;
