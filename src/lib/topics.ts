
import type { BlogTopic, TopicConfig } from '@/types';
import {
  Terminal, Palette, Utensils, HeartPulse, Plane, ChefHat, BookMarked, AlertTriangle, Gamepad2 // Added Gamepad2
} from 'lucide-react';

// Define the configuration for each topic
export const TOPICS: Record<BlogTopic, TopicConfig> = {
  tech: { label: 'Tech', icon: Terminal, className: 'theme-tech' }, // Default, uses base variables
  classic: { label: 'Classic', icon: Palette, className: 'theme-classic' },
  food: { label: 'Food', icon: Utensils, className: 'theme-food' },
  health: { label: 'Health', icon: HeartPulse, className: 'theme-health' },
  travel: { label: 'Travel', icon: Plane, className: 'theme-travel' },
  cooking: { label: 'Cooking', icon: ChefHat, className: 'theme-cooking' },
  guides: { label: 'Guides', icon: BookMarked, className: 'theme-guides' },
  gaming: { label: 'Gaming', icon: Gamepad2, className: 'theme-gaming' }, // Added Gaming
  mature: { label: 'Mature', icon: AlertTriangle, className: 'theme-mature' },
};

export const ALL_TOPICS = Object.keys(TOPICS) as BlogTopic[];
export const ALL_TOPIC_CONFIGS = Object.values(TOPICS);

// Helper function to get topic info by topic key
export const getTopicInfo = (topic?: BlogTopic): TopicConfig | null => {
    if (!topic || !TOPICS[topic]) return null;
    return TOPICS[topic];
};

// Helper to get topic key from class name
export const getTopicFromClassName = (className: string): BlogTopic | null => {
    for (const [key, config] of Object.entries(TOPICS)) {
        if (config.className === className) {
            return key as BlogTopic;
        }
    }
    return null; // Default to tech if no specific class found
};

