import { ref } from "vue";
import { defineStore } from "pinia";
import type { Product } from "@/data/products";
import type { QuizAnswers } from "@/composables/useQuiz";

interface QuoteContext {
  product?: Product
  source?: string
  quizAnswers?: QuizAnswers
}

export const useUiStore = defineStore("ui", () => {
  const quoteOpen = ref(false);
  const quoteProduct = ref<Product | null>(null);
  const quoteSource = ref<string | undefined>(undefined);
  const quoteQuizAnswers = ref<QuizAnswers | undefined>(undefined);

  const openQuote = (opts?: Product | QuoteContext) => {
    if (!opts) {
      quoteProduct.value = null;
      quoteSource.value = undefined;
      quoteQuizAnswers.value = undefined;
    } else if ('id' in opts && 'name' in opts) {
      // Legacy: called with a Product directly
      quoteProduct.value = opts as Product;
      quoteSource.value = 'product';
      quoteQuizAnswers.value = undefined;
    } else {
      const ctx = opts as QuoteContext;
      quoteProduct.value = ctx.product ?? null;
      quoteSource.value = ctx.source;
      quoteQuizAnswers.value = ctx.quizAnswers;
    }
    quoteOpen.value = true;
  };

  const closeQuote = () => {
    quoteOpen.value = false;
    quoteProduct.value = null;
    quoteSource.value = undefined;
    quoteQuizAnswers.value = undefined;
  };

  return { quoteOpen, quoteProduct, quoteSource, quoteQuizAnswers, openQuote, closeQuote };
});
