import { supabase } from "./supabase";
import type { ComponentItem } from '../types';

// Retrieve the component data
export const inventoryService = {

    //Retrieve entire component data
    async getAllComponents(): Promise<ComponentItem[]> {
        const { data, error } = await supabase
            .from('components')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.log("Error encountered at getAllComponents ", error.message);
            throw new Error('Could not load the inventory. Please try again.');
        }

        return (data || []) as ComponentItem[];
    },

    // Retrieve individual component data, by id
    async getComponentById(id: string): Promise<ComponentItem | null> {
        const { data, error } = await supabase
            .from('components')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            return null;
        }

        return data as ComponentItem;
    }
};