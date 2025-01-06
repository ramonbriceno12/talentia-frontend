'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';

const steps = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Upload Resume' },
  { id: 3, label: 'Select Skills' },
];

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null,
    skills: [],
  });

  const [skillsOptions, setSkillsOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/skills');
        const data = await response.json();
        const formattedSkills = data.map(skill => ({
          value: skill.name,
          label: skill.name,
        }));
        setSkillsOptions(formattedSkills);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFormChange = (e: any) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSkillsChange = (selectedSkills) => {
    setFormData((prev) => ({
      ...prev,
      skills: selectedSkills,
    }));
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
      <motion.div
        key={step}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-gray-900"
      >
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-semibold mb-6">Personal Information</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full p-3 rounded border focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-lg">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full p-3 rounded border focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-semibold mb-6">Upload Your Resume</h2>
            <div className="flex flex-col items-center border-2 border-dashed p-10 rounded-lg hover:border-indigo-500">
              <input
                type="file"
                id="resume"
                name="resume"
                accept="application/pdf"
                onChange={handleFormChange}
                className="hidden"
              />
              <label htmlFor="resume" className="cursor-pointer text-indigo-600">
                {formData.resume ? formData.resume.name : 'Click to upload your resume (PDF)'}
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-3xl font-semibold mb-6">Select Your Skills</h2>
            {loading ? (
              <p>Loading skills...</p>
            ) : (
                <Select
                  isMulti
                  name="skills"
                  options={skillsOptions}
                  value={formData.skills}
                  onChange={handleSkillsChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select skills..."
                  isSearchable
                  filterOption={(candidate, input) => {
                    const results = skillsOptions
                      .filter(skill =>
                        skill.label.toLowerCase().includes(input.toLowerCase())
                      )
                      .slice(0, 5); // Limit to 5 options
                    return results.some(result => result.value === candidate.value);
                  }}
                />
            )}
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded"
            >
              Back
            </button>
          )}
          {step < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 px-6 py-2 text-white rounded"
            >
              Submit
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
