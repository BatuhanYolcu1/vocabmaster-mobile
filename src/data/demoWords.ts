import AsyncStorage from '@react-native-async-storage/async-storage';

export type StudyWord = {
  id: string;
  word: string;
  tr: string;
  def: string;
  example: string;
  exampleTr: string;
  type: string;
};

export type DefaultList = {
  id: string;
  name: string;
  color: string;
  bg: string;
  symbol: string;
  words: StudyWord[];
};

export const DEFAULT_LISTS: DefaultList[] = [
  {
    id: '1', name: 'B1 Temel Kelimeler', color: '#5B4CF5', bg: '#EEF2FF', symbol: 'book.fill',
    words: [
      { id: '1',  word: 'Eloquent',    tr: 'Belagatlı',      def: 'Güzel ve etkili konuşma yeteneğine sahip', example: 'She gave an eloquent speech.',          exampleTr: 'Belagatlı bir konuşma yaptı.',             type: 'adjective' },
      { id: '2',  word: 'Serendipity', tr: 'Güzel tesadüf',  def: 'Şans eseri yapılan güzel bir keşif',       example: 'Finding that book was pure serendipity.',  exampleTr: 'O kitabı bulmak saf bir tesadüftü.',        type: 'noun'      },
      { id: '3',  word: 'Resilient',   tr: 'Dayanıklı',      def: 'Zorluklardan çabuk toparlanabilen',        example: 'Children are remarkably resilient.',       exampleTr: 'Çocuklar inanılmaz derecede dayanıklıdır.', type: 'adjective' },
      { id: '4',  word: 'Ephemeral',   tr: 'Geçici',         def: 'Çok kısa süren, geçici olan',              example: 'Fame can be ephemeral.',                   exampleTr: 'Şöhret geçici olabilir.',                  type: 'adjective' },
      { id: '5',  word: 'Meticulous',  tr: 'Titiz',          def: 'Her detaya özen gösteren',                 example: 'She is meticulous in her work.',           exampleTr: 'İşinde çok titizdir.',                     type: 'adjective' },
      { id: '6',  word: 'Ambiguous',   tr: 'Belirsiz',       def: 'Birden fazla anlama gelebilen',            example: 'The message was ambiguous.',               exampleTr: 'Mesaj belirsizdi.',                        type: 'adjective' },
      { id: '7',  word: 'Diligent',    tr: 'Çalışkan',       def: 'İşine özen ve gayret gösteren',            example: 'He is a diligent student.',                exampleTr: 'Çalışkan bir öğrencidir.',                 type: 'adjective' },
      { id: '8',  word: 'Tenacious',   tr: 'Azimli',         def: 'Hedefinden vazgeçmeyen, ısrarcı',          example: 'She is tenacious in her goals.',           exampleTr: 'Hedeflerinde azimlidir.',                  type: 'adjective' },
      { id: '9',  word: 'Benevolent',  tr: 'Hayırsever',     def: 'İyilik yapmaktan hoşlanan',               example: 'A benevolent donation.',                   exampleTr: 'Hayırsever bir bağış.',                    type: 'adjective' },
      { id: '10', word: 'Candid',      tr: 'Dürüst',         def: 'Açık sözlü, samimi',                      example: 'Please be candid with me.',                exampleTr: 'Lütfen benimle dürüst ol.',                type: 'adjective' },
    ],
  },
  {
    id: '2', name: 'İş İngilizcesi', color: '#22C55E', bg: '#F0FDF4', symbol: 'briefcase.fill',
    words: [
      { id: '1', word: 'Leverage',    tr: 'Kaldıraç etkisi', def: 'Bir avantajı en iyi şekilde kullanmak',      example: 'We can leverage our network.',               exampleTr: 'Ağımızı kullanabiliriz.',                      type: 'noun' },
      { id: '2', word: 'Streamline',  tr: 'Sadeleştirmek',   def: 'Süreci daha verimli hale getirmek',          example: 'We need to streamline our process.',         exampleTr: 'Sürecimizi sadeleştirmeliyiz.',                type: 'verb' },
      { id: '3', word: 'Synergy',     tr: 'Sinerji',         def: 'İki unsurun birlikte daha güçlü olması',     example: 'There is great synergy in this team.',       exampleTr: 'Bu ekipte büyük sinerji var.',                 type: 'noun' },
      { id: '4', word: 'Delegate',    tr: 'Yetki devretmek', def: 'Görevi başka birine aktarmak',               example: 'A good manager knows how to delegate.',      exampleTr: 'İyi bir yönetici nasıl yetki devredeceğini bilir.', type: 'verb' },
      { id: '5', word: 'Milestone',   tr: 'Kilometre taşı',  def: 'Projedeki önemli başarı noktası',            example: 'We reached a major milestone.',              exampleTr: 'Büyük bir kilometre taşına ulaştık.',          type: 'noun' },
    ],
  },
  {
    id: '3', name: 'Akademik Kelimeler', color: '#A855F7', bg: '#F5F3FF', symbol: 'graduationcap.fill',
    words: [
      { id: '1', word: 'Hypothesis',  tr: 'Hipotez',    def: 'Kanıtlanmayı bekleyen önerme',              example: 'The hypothesis was confirmed.',        exampleTr: 'Hipotez doğrulandı.',                   type: 'noun'      },
      { id: '2', word: 'Empirical',   tr: 'Ampirik',    def: 'Gözlem ve deneyime dayalı',                 example: 'Empirical evidence is crucial.',        exampleTr: 'Ampirik kanıt çok önemlidir.',          type: 'adjective' },
      { id: '3', word: 'Paradigm',    tr: 'Paradigma',  def: 'Düşünce veya araştırmada temel model',     example: 'A paradigm shift in science.',          exampleTr: 'Bilimde bir paradigma değişimi.',       type: 'noun'      },
      { id: '4', word: 'Synthesis',   tr: 'Sentez',     def: 'Farklı unsurları birleştirme',              example: 'A synthesis of ideas.',                exampleTr: 'Fikirlerin sentezi.',                   type: 'noun'      },
    ],
  },
  {
    id: '4', name: 'Seyahat', color: '#F97316', bg: '#FFF7ED', symbol: 'airplane',
    words: [
      { id: '1', word: 'Itinerary',     tr: 'Seyahat planı', def: 'Gezi için hazırlanmış detaylı plan', example: 'Check the itinerary.',                  exampleTr: 'Seyahat planına bak.',      type: 'noun' },
      { id: '2', word: 'Accommodation', tr: 'Konaklama',     def: 'Seyahatte kalınacak yer',            example: 'Book your accommodation early.',         exampleTr: 'Konaklamayı erken ayırın.', type: 'noun' },
      { id: '3', word: 'Departure',     tr: 'Kalkış',        def: 'Bir yerden ayrılma, kalkış',         example: 'Check the departure time.',             exampleTr: 'Kalkış saatini kontrol et.', type: 'noun' },
    ],
  },
];

export async function loadStudyWords(listId: string | undefined): Promise<StudyWord[]> {
  if (!listId) return DEFAULT_LISTS[0].words;
  const def = DEFAULT_LISTS.find(l => l.id === listId);
  if (def) return def.words;

  try {
    const raw = await AsyncStorage.getItem(`words_${listId}`);
    if (!raw) return DEFAULT_LISTS[0].words;
    const custom: Record<string, string>[] = JSON.parse(raw);
    return custom.map((w, i) => ({
      id: w.id || String(i),
      word: w.word || '',
      tr: w.tr || '',
      def: w.def || '',
      example: w.example || '',
      exampleTr: w.exampleTr || '',
      type: w.type || 'noun',
    }));
  } catch {
    return DEFAULT_LISTS[0].words;
  }
}
