'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';

const steps = [
  { id: 1, label: 'Job Details' },
  { id: 2, label: 'Location & Salary' },
  { id: 3, label: 'Company Info' },
];

export default function MultiStepJobForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skills: [],
    location: '',
    salary: '',
    isRemote: false,
    companyName: '',
    email: '',
    logo: null,
  });

  const [skillsOptions, setSkillsOptions] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/skills');
        const data = await response.json();
        const formattedSkills = data.map(skill => ({
          value: skill.id,
          label: skill.name,
          category: skill.category
        }));
        setSkillsOptions(formattedSkills);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFormChange = (e: any) => {
    const { name, value, files, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : files ? files[0] : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSkillsChange = (selectedSkills) => {
    setFormData((prev) => ({
      ...prev,
      skills: selectedSkills,
    }));
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 text-white">
      <motion.div
        key={step}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white p-10 rounded-lg shadow-lg text-gray-900"
      >
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-semibold mb-6">Job Details</h2>
            <div className="mb-4">
              <label htmlFor="title" className="block text-lg">Job Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full p-3 rounded border focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-lg">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleFormChange}
                className="w-full p-3 rounded border focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block text-lg">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full p-3 rounded border focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Category</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Marketer">Marketer</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="skills" className="block text-lg">Skills (Search & Select)</label>
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
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-semibold mb-6">Location & Salary</h2>
            <div className="mb-4">
              <label htmlFor="location" className="block text-lg">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                className="w-full p-3 rounded border focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="salary" className="block text-lg">Salary Range</label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleFormChange}
                className="w-full p-3 rounded border focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRemote"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleFormChange}
              />
              <label htmlFor="isRemote" className="ml-2">Remote Position</label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-3xl font-semibold mb-6">Company Info</h2>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button onClick={prevStep} className="bg-gray-300 px-6 py-2 rounded">
              Back
            </button>
          )}
          {step < steps.length ? (
            <button onClick={nextStep} className="bg-green-600 px-6 py-2 text-white rounded">
              Next
            </button>
          ) : (
            <button type="submit" className="bg-blue-500 px-6 py-2 text-white rounded">
              Submit Job
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
