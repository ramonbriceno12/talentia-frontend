"use client";

import { useState } from "react";
import { FaEdit, FaSave, FaTimes, FaTrash, FaPlus, FaLink, FaGithub, FaLinkedin, FaBriefcase } from "react-icons/fa";

export default function LinksSection({
  links,
  talentId,
  onSave
}: {
  links: { link_type: string; url: string }[];
  talentId: number;
  onSave: (updatedLinks: { link_type: string; url: string }[]) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedLinks, setUpdatedLinks] = useState([...links]);

  // Get the correct icon for each link type
  const getIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("linkedin")) return <FaLinkedin className="text-blue-600" />;
    if (lowerType.includes("github")) return <FaGithub className="text-gray-700" />;
    if (lowerType.includes("portfolio")) return <FaBriefcase className="text-yellow-500" />;
    return <FaLink className="text-gray-500" />;
  };

  // Handle input change
  const handleChange = (index: number, field: string, value: string) => {
    const newLinks = [...updatedLinks];
    newLinks[index][field] = value;
    setUpdatedLinks(newLinks);
  };

  // Add new link field
  const addLink = () => {
    setUpdatedLinks([...updatedLinks, { link_type: "", url: "" }]);
  };

  // Remove a link
  const removeLink = (index: number) => {
    setUpdatedLinks(updatedLinks.filter((_, i) => i !== index));
  };

  // Save updated links
  const handleSave = async () => {
    if (!updatedLinks.length) {
      alert("Please add at least one link!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/talents/links/${talentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ links: updatedLinks }),
      });

      if (!response.ok) throw new Error("Failed to update links");

      onSave(updatedLinks); // Update parent state
      setIsEditing(false);
      alert("Links updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white shadow-md p-4 rounded relative">
      {/* Header with Edit & Close Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#244c56]">Links</h2>

        {isEditing ? (
          <div className="flex space-x-2">
            <button
              className="bg-[#244c56] text-white px-4 py-2 rounded hover:bg-[#349390] transition"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Guardando..." : <><FaSave size={16} className="inline-block mr-2" /> Guardar</>}
            </button>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={() => {
                setUpdatedLinks([...links]); // Reset to original links
                setIsEditing(false);
              }}
            >
              <FaTimes size={16} className="inline-block mr-2" /> Cancelar
            </button>
          </div>
        ) : (
          <button
            className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded"
            onClick={() => setIsEditing(true)}
          >
            <FaEdit size={18} className="inline-block mr-2" /> Editar
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          {updatedLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg shadow-sm border border-gray-300 mt-3">
              <span className="text-gray-500 text-xl">{getIcon(link.link_type)}</span>
              <input
                type="text"
                placeholder="Nombre (LinkedIn, GitHub...)"
                value={link.link_type}
                onChange={(e) => handleChange(index, "link_type", e.target.value)}
                className="p-2 w-1/3 border rounded-lg text-[#244c56]"
              />
              <input
                type="url"
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleChange(index, "url", e.target.value)}
                className="p-2 w-2/3 border rounded-lg text-[#244c56]"
              />
              <button className="text-red-500" onClick={() => removeLink(index)}>
                <FaTrash />
              </button>
            </div>
          ))}
          <button className="mt-3 flex items-center gap-2 px-4 py-2 bg-[#244c56] hover:bg-[#349390] text-white rounded-lg" onClick={addLink}>
            <FaPlus /> Agregar
          </button>
        </>
      ) : (
        <div>
          {links.length > 0 ? (
            links.map((link, index) => (
              <div key={index} className="flex items-center gap-2 text-lg text-[#244c56]">
                {getIcon(link.link_type)}
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {link.link_type}
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tienes links agregados</p>
          )}
        </div>
      )}
    </div>
  );
}
